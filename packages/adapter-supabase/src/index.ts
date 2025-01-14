import {
  Adapter,
  camelToSnake,
  Events,
  PageView,
  Session,
  snakeToCamel,
  Visitor,
} from "@loglib/core";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseAdapter = (db: SupabaseClient): Adapter => {
  return {
    async createSession(data) {
      const response = (await db
        .from("web_session")
        .insert(camelToSnake(data))
        .select("*")
        .single()
        .throwOnError()) as {
        data: {
          id: string;
          query_params: string;
        };
      };
      const resData = {
        ...response.data,
        query_params: JSON.parse(response.data?.query_params as string),
      };
      return snakeToCamel(resData) as unknown as Session;
    },
    async updateSession(data, id) {
      const response = (await db
        .from("web_session")
        .update(camelToSnake({ ...data }))
        .match({ id })
        .select("*")
        .single()) as {
        data: {
          id: string;
          query_params: string;
        };
      };
      const resData = {
        ...response.data,
        query_params: JSON.parse(response.data?.query_params as string),
      };
      return snakeToCamel(resData) as unknown as Session;
    },
    async createPageView(data) {
      const response = (await db
        .from("web_pageview")
        .insert(camelToSnake(data))
        .select("*")
        .single()
        .throwOnError()) as {
        data: {
          id: string;
          query_params: string;
        };
      };
      const resData = {
        ...response.data,
        query_params: JSON.parse(response.data?.query_params as string),
      };
      return snakeToCamel(resData) as unknown as PageView;
    },
    async createManyEvents(data) {
      const promises = data.map(async (event) => {
        const response = await db
          .from("web_event")
          .upsert(camelToSnake(event))
          .select("*")
          .single()
          .throwOnError();
        return response.data as unknown as Events;
      });
      return Promise.all(promises).catch((error) => {
        console.log(error);
        throw error;
      });
    },
    async updatePageView(data) {
      const response = (await db
        .from("web_pageview")
        .update(camelToSnake(data))
        .eq("id", data.id)
        .select("*")
        .single()
        .throwOnError()) as {
        data: {
          id: string;
          query_params: string;
        };
      };
      const resData = {
        ...response.data,
        query_params: JSON.parse(response.data?.query_params as string),
      };
      return snakeToCamel(resData) as unknown as PageView;
    },
    async upsertVisitor(data) {
      const response = (await db
        .from("web_visitor")
        .upsert(camelToSnake(data))
        .select("*")
        .single()
        .throwOnError()) as {
        data: {
          id: string;
          data: string;
        };
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const resData = {
        ...response.data,
        data: JSON.parse(response.data?.data),
      };
      return snakeToCamel(resData) as unknown as Visitor;
    },
    async getVisitor(startDate, endDate) {
      const res = (
        await db
          .from("web_visitor")
          .select("*")
          .gte("created_at", startDate.toUTCString())
          .lte("created_at", endDate.toUTCString())
          .select("*")
      ).data as unknown as Visitor[];
      return snakeToCamel(res);
    },
    async getEvents(startDate, endDate) {
      const res = (await db
        .from("web_event")
        .select("*")
        .gte("created_at", startDate.toUTCString())
        .lte("created_at", endDate.toUTCString())
        .select("*")
        .throwOnError()) as {
        data: {
          id: string;
          payload: string;
        }[];
      };
      if (res.data === null || res.data.length === 0) {
        return [];
      }
      res.data = res.data.map((event) => {
        event.payload = JSON.parse(event.payload as string);
        return event;
      });
      return snakeToCamel(res.data as object) as unknown as Events[];
    },
    async getPageViews(startDate, endDate) {
      const res = (await db
        .from("web_pageview")
        .select("*")
        .gte("created_at", startDate.toUTCString())
        .lte("created_at", endDate.toUTCString())) as {
        data: {
          id: string;
          query_params: string;
        }[];
      };
      return snakeToCamel(res.data as object) as unknown as PageView[];
    },
    async getSession(startDate, endDate) {
      const res = (await db
        .from("web_session")
        .select("*")
        .gte("created_at", startDate.toUTCString())
        .lte("created_at", endDate.toUTCString())
        .select("*")) as {
        data: {
          id: string;
          query_params: string;
        }[];
      };
      if (res.data === null || res.data.length === 0) {
        return [];
      }
      res.data = res.data.map((session) => {
        session.query_params = JSON.parse(session.query_params as string);
        return session;
      });
      return snakeToCamel(res.data as unknown as Session[]);
    },
  };
};
export { supabaseAdapter };
