import { BaseService } from "./BaseService";
import { BaseEntity } from "../domain/BaseEntity";

export abstract class BaseEntityService<TEntity extends BaseEntity> extends BaseService {
  protected constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(url = ""): Promise<TEntity[] | undefined> {
    try {
      const response = await this.axios.get<TEntity[]>(url);

      console.log("response", response);
      if (response.status === 200) {
        return response.data;
      }
      return undefined;
    } catch (e: any) {
      console.log("error", e);
      throw Error(e.message);
    }
  }

  async add(data: TEntity, url: string = ""): Promise<TEntity | undefined> {
    try {
      const response = await this.axios.post<TEntity>(url, data);
      if (response.status === 201) {
        console.log('response', response)
        return response.data;
      }
      return undefined;
    } catch (e: any) {
      console.log("error", e);
      throw Error(e.response?.data?.message ?? e.message ?? 'Unknown error');
    }
  }

  async delete(id: string, url=""): Promise<void> {
    try {
      const response = await this.axios.delete<void>(`${url}/${id}`);
      if (response.status !== 200) {
        return Promise.reject(response.statusText);
      }
    } catch (e: any) {
      console.log("error", e);
      throw Error(e.response?.data?.message ?? e.message ?? 'Unknown error');
    }

  }
}
