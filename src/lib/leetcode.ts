/**
 * LeetCode API Service
 * Fetches recent submissions and verifies problem completions
 */

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql/";

interface LeetCodeSubmission {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
}

interface RecentSubmissionsResponse {
    data: {
        recentAcSubmissionList: LeetCodeSubmission[];
    };
}

/**
 * Fetch recent accepted submissions for a LeetCode user
 */
export async function getRecentAcceptedSubmissions(
    username: string,
    limit: number = 20
): Promise<LeetCodeSubmission[]> {
    const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

    try {
        const response = await fetch(LEETCODE_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: { username, limit },
            }),
        });

        if (!response.ok) {
            throw new Error(`LeetCode API error: ${response.status}`);
        }

        const data = (await response.json()) as RecentSubmissionsResponse;
        return data.data.recentAcSubmissionList ?? [];
    } catch (error) {
        console.error("Failed to fetch LeetCode submissions:", error);
        return [];
    }
}

/**
 * Verify if a user has completed a specific problem
 * @param username - LeetCode username
 * @param problemSlug - The problem slug (e.g., "two-sum")
 * @param since - Optional timestamp to check submissions after
 */
export async function verifyProblemCompletion(
    username: string,
    problemSlug: string,
    since?: Date
): Promise<{ verified: boolean; submissionId?: string; timestamp?: Date }> {
    const submissions = await getRecentAcceptedSubmissions(username, 50);

    const matchingSubmission = submissions.find((s) => {
        const slugMatch = s.titleSlug === problemSlug;
        if (!slugMatch) return false;

        if (since) {
            const submissionTime = new Date(parseInt(s.timestamp) * 1000);
            return submissionTime >= since;
        }

        return true;
    });

    if (matchingSubmission) {
        return {
            verified: true,
            submissionId: matchingSubmission.id,
            timestamp: new Date(parseInt(matchingSubmission.timestamp) * 1000),
        };
    }

    return { verified: false };
}

/**
 * Check if a LeetCode username exists and is public
 */
export async function validateLeetCodeUsername(
    username: string
): Promise<boolean> {
    const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
      }
    }
  `;

    try {
        const response = await fetch(LEETCODE_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: { username },
            }),
        });

        const data = (await response.json()) as {
            data: { matchedUser: { username: string } | null };
        };

        return data.data.matchedUser !== null;
    } catch {
        return false;
    }
}
