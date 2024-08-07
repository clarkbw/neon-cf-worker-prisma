import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../types";
import { getClient } from "../db";

export class TaskCreate extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Tasks"],
    summary: "Create a new Task",
    requestBody: Task,
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      "200": {
        description: "Returns the created task",
        schema: {
          success: Boolean,
          result: {
            task: Task,
          },
        },
      },
    },
  };

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>,
  ) {
    // Retrieve the validated request body
    const { name, slug, description, completed, due_date } = data.body;

    try {
      if (!env.authenticated) {
        throw new Error("endpoint requires authentication");
      }

      // Implement your own object insertion here
      const prisma = await getClient(env);

      const task = await prisma.task.create({
        data: {
          name,
          slug,
          description,
          completed,
          due_date,
        },
      });

      // return the new task
      return {
        success: true,
        result: {
          task,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        error: e,
      };
    }
  }
}
