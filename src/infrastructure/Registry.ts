import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "./persistence/prisma/PrismaUserRepository";
import { PrismaProblemRepository } from "./persistence/prisma/PrismaProblemRepository";
import { PrismaCurriculumRepository } from "./persistence/prisma/PrismaCurriculumRepository";
import { StripeAdapter } from "./adapters/stripe/StripeAdapter";
import { PistonAdapter } from "./adapters/piston/PistonAdapter";
import { LocalJSAdapter } from "./adapters/piston/LocalJSAdapter";
import { UnifiedCodeExecutionAdapter } from "./adapters/piston/UnifiedCodeExecutionAdapter";
import { GeminiAdapter } from "./adapters/gemini/GeminiAdapter";
import { db } from "@/lib/db";

// Factory to provide instances of Use Cases and Adapters
export class Registry {
    private static prisma = db;

    static getUserRepository() {
        return new PrismaUserRepository(this.prisma);
    }

    static getProblemRepository() {
        return new PrismaProblemRepository(this.prisma);
    }

    static getCurriculumRepository() {
        return new PrismaCurriculumRepository(this.prisma);
    }

    static getPaymentGateway() {
        return new StripeAdapter(process.env.STRIPE_SECRET_KEY || "");
    }

    static getCodeExecutionService() {
        return new UnifiedCodeExecutionAdapter(
            new LocalJSAdapter(),
            new PistonAdapter()
        );
    }

    static getAIService() {
        return new GeminiAdapter(process.env.GEMINI_API_KEY || "");
    }
}

