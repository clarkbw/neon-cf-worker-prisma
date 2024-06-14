import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../types";
import { getClient } from "../db";

export class TaskDelete extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Tasks"],
    summary: "Delete a Task",
    parameters: {
      taskSlug: Path(String, {
        description: "Task slug",
      }),
    },
    responses: {
      "200": {
        description: "Returns if the task was deleted successfully",
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
    // Retrieve the validated slug
    const { taskSlug } = data.params;

    try {
      // Implement your own object deletion here
      const prisma = await getClient(env);

      const task = await prisma.task.delete({
        where: {
          slug: taskSlug,
        },
      });

      // Return the deleted task for confirmation
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
        error: JSON.stringify(e),
      };
    }
  }
}
