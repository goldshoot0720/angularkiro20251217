import { Injectable } from '@angular/core';
import { createClient, NhostClient } from '@nhost/nhost-js';

@Injectable({
  providedIn: 'root'
})
export class NhostService {
  private nhost: NhostClient;
  private graphqlUrl: string;

  constructor() {
    const subdomain = 'uxgwdiuehabbzenwtcqo';
    const region = 'eu-central-1';
    
    console.log('初始化 Nhost 客戶端:', { subdomain, region });
    
    // 手動構建 GraphQL URL
    this.graphqlUrl = `https://${subdomain}.graphql.${region}.nhost.run/v1`;
    
    try {
      this.nhost = createClient({
        subdomain,
        region
      });
      
      console.log('Nhost 客戶端初始化成功');
      console.log('Nhost GraphQL URL:', this.graphqlUrl);
      
      // 驗證客戶端是否正確初始化
      if (this.nhost && this.nhost.auth) {
        console.log('Nhost auth 模組可用');
      } else {
        console.warn('Nhost auth 模組不可用');
      }
      
    } catch (error) {
      console.error('Nhost 客戶端初始化失敗:', error);
      throw error;
    }
  }

  get client() {
    return this.nhost;
  }

  get auth() {
    return this.nhost.auth;
  }

  get storage() {
    return this.nhost.storage;
  }

  get graphql() {
    return this.nhost.graphql;
  }

  getGraphqlUrl(): string {
    return this.graphqlUrl;
  }

  // 測試連接方法
  async testConnection(): Promise<boolean> {
    try {
      const query = `query { __typename }`;
      await this.graphqlRequest(query);
      return true;
    } catch (error) {
      console.error('連接測試失敗:', error);
      return false;
    }
  }

  // 修復的 GraphQL 請求方法
  async graphqlRequest(query: string, variables?: any) {
    try {
      // 確保請求體是正確的 JSON 格式
      const requestBody = {
        query: query.trim(),
        ...(variables && { variables })
      };
      
      console.log('GraphQL 請求:', requestBody);
      
      // 暫時使用匿名請求，稍後可以添加認證
      let authHeaders = {};
      console.log('使用匿名請求（無認證標頭）');
      
      console.log('認證標頭:', authHeaders);
      
      // 使用 fetch 直接發送請求
      const response = await fetch(this.graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('GraphQL 回應:', result);
      
      if (result.errors) {
        console.error('GraphQL 錯誤:', result.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      
      return result;
    } catch (error: any) {
      console.error('GraphQL 請求失敗:', error);
      throw error;
    }
  }
}