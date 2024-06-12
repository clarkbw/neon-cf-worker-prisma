import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../types";
// import { getClient } from "../db";

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
    // const client = getClient();
    // const { rows } = await client.query("SELECT * FROM tasks WHERE completed = ?;");
    // const tasks = JSON.stringify(rows);

    const tasks = [
      {
        name: "Clean my room",
        slug: "clean-room",
        description: null,
        completed: false,
        due_date: "2025-01-05",
      },
      {
        name: "Build something awesome with Neon & Cloudflare Workers",
        slug: "cloudflare-workers",
        description: "Lorem Ipsum",
        completed: true,
        due_date: "2022-12-24",
      },
    ].filter((t) => isCompleted === undefined || t.completed == isCompleted);

    return {
      success: true,
      tasks,
    };
  }
}
