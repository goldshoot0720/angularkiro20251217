import { Injectable } from '@angular/core';
import { NhostService } from './nhost.service';

export interface Food {
  id: string;
  name: string;
  amount: number;
  price: number;
  shop: string;
  to_date?: string;
  photo?: string;
  photohash?: string;
}

export interface CreateFoodInput {
  name: string;
  amount: number;
  to_date: string;
  photo?: string;
}

export interface UpdateFoodInput {
  name?: string;
  amount?: number;
  to_date?: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  constructor(private nhost: NhostService) {}

  // 公開 nhost 實例供測試使用
  get nhostClient() {
    return this.nhost;
  }

  // 測試 GraphQL 連接
  async testConnection(): Promise<boolean> {
    try {
      const query = `query { __typename }`;
      await this.nhost.graphqlRequest(query);
      console.log('GraphQL 連接測試成功');
      return true;
    } catch (error: any) {
      console.error('GraphQL 連接測試失敗:', error);
      return false;
    }
  }

  // 查詢所有食品（按到期日期排序，由近至遠）
  async getAllFoods(): Promise<Food[]> {
    const query = `
      query GetAllFoods {
        food(order_by: {to_date: asc}) {
          id
          name
          amount
          price
          shop
          to_date
          photo
          photohash
        }
      }
    `;

    try {
      console.log('正在查詢食品資料（按到期日期排序）...');
      
      const result = await this.nhost.graphqlRequest(query);
      console.log('GraphQL 查詢結果:', result);
      
      if (result.errors) {
        console.error('GraphQL 錯誤:', result.errors);
        throw new Error(`GraphQL 錯誤: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }
      
      const foods = result.data?.food || [];
      console.log(`載入 ${foods.length} 項食品，已按到期日期排序`);
      
      return foods;
    } catch (error: any) {
      console.error('載入食品失敗:', error);
      throw new Error(`載入食品失敗: ${error.message || '未知錯誤'}`);
    }
  }



  // 根據 ID 查詢單一食品
  async getFoodById(id: string): Promise<Food | null> {
    const query = `
      query GetFoodById($id: uuid!) {
        food_by_pk(id: $id) {
          id
          name
          amount
          price
          shop
          to_date
          photo
          photohash
        }
      }
    `;

    try {
      const result = await this.nhost.graphqlRequest(query, { id });
      return result.data?.food_by_pk || null;
    } catch (error) {
      console.error('Error fetching food by id:', error);
      throw error;
    }
  }

  // 新增食品
  async createFood(input: CreateFoodInput): Promise<Food> {
    const mutation = `
      mutation CreateFood($input: food_insert_input!) {
        insert_food_one(object: $input) {
          id
          name
          amount
          price
          shop
          to_date
          photo
          photohash
        }
      }
    `;

    try {
      const result = await this.nhost.graphqlRequest(mutation, { input });
      
      if (result.errors) {
        console.error('GraphQL 錯誤:', result.errors);
        throw new Error(`GraphQL 錯誤: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }
      
      return result.data?.insert_food_one;
    } catch (error: any) {
      console.error('新增食品失敗:', error);
      throw error;
    }
  }

  // 更新食品
  async updateFood(id: string, input: UpdateFoodInput): Promise<Food> {
    const mutation = `
      mutation UpdateFood($id: uuid!, $input: food_set_input!) {
        update_food_by_pk(pk_columns: {id: $id}, _set: $input) {
          id
          name
          amount
          price
          shop
          to_date
          photo
          photohash
        }
      }
    `;

    try {
      const result = await this.nhost.graphqlRequest(mutation, { id, input });
      return result.data?.update_food_by_pk;
    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  }

  // 刪除食品
  async deleteFood(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteFood($id: uuid!) {
        delete_food_by_pk(id: $id) {
          id
        }
      }
    `;

    try {
      const result = await this.nhost.graphqlRequest(mutation, { id });
      return !!result.data?.delete_food_by_pk;
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  }

  // 根據商店查詢食品（按到期日期排序）
  async getFoodsByShop(shop: string): Promise<Food[]> {
    const query = `
      query GetFoodsByShop($shop: String!) {
        food(where: {shop: {_eq: $shop}}, order_by: {to_date: asc}) {
          id
          name
          amount
          price
          shop
          to_date
          photo
          photohash
        }
      }
    `;

    try {
      const result = await this.nhost.graphqlRequest(query, { shop });
      return result.data?.food || [];
    } catch (error) {
      console.error('Error fetching foods by shop:', error);
      throw error;
    }
  }

  // 搜尋食品（根據名稱，按到期日期排序）
  async searchFoods(searchTerm: string): Promise<Food[]> {
    const query = `
      query SearchFoods($searchTerm: String!) {
        food(where: {name: {_ilike: $searchTerm}}, order_by: {to_date: asc}) {
          id
          name
          amount
          price
          shop
          to_date
          photo
          photohash
        }
      }
    `;

    try {
      const result = await this.nhost.graphqlRequest(query, { 
        searchTerm: `%${searchTerm}%` 
      });
      return result.data?.food || [];
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }

  // 獲取食品統計資訊
  async getFoodStats(): Promise<{
    totalItems: number;
    totalValue: number;
    shopCount: number;
    averagePrice: number;
  }> {
    const query = `
      query GetFoodStats {
        food_aggregate {
          aggregate {
            count
            sum {
              amount
              price
            }
            avg {
              price
            }
          }
        }
        food(distinct_on: shop) {
          shop
        }
      }
    `;

    try {
      const result = await this.nhost.graphqlRequest(query);
      const aggregate = result.data?.food_aggregate?.aggregate;
      const shops = result.data?.food || [];

      return {
        totalItems: aggregate?.count || 0,
        totalValue: aggregate?.sum?.price || 0,
        shopCount: shops.length,
        averagePrice: aggregate?.avg?.price || 0
      };
    } catch (error) {
      console.error('Error fetching food stats:', error);
      throw error;
    }
  }
}