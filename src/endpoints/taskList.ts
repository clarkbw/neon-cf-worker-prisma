import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../types";
import { getClient } from "../db";

export class TaskList extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Tasks"],
    summary: "List Tasks",
    parameters: {
      page: Query(Number, {
        description: "Page number",
        default: 0,
      }),
      isCompleted: Query(Boolean, {
        description: "Filter by completed flag",
        required: false,
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of tasks",
        schema: {
          success: Boolean,
          result: {
            tasks: [Task],
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
    // Retrieve the validated parameters
    const { page, isCompleted } = data.query;

    // Implement your own object list here
    const prisma = await getClient(env);

    try {
      // completed can be undefined and it works like you want
      // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined#undefined
      const tasks = await prisma.task.findMany({
        skip: page * 10,
        take: 10,
        where: {
          completed: isCompleted,
        },
      });

      return {
        success: true,
        result: {
          tasks,
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
