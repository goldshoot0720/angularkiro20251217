import { Injectable } from '@angular/core';
import { NhostService } from './nhost.service';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Subscription {
  id: string;
  name: string;
  site: string;
  price: number;
  nextdate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private nhost: NhostService) {}

  // 獲取所有訂閱
  getSubscriptions(): Observable<Subscription[]> {
    const query = `
      query GetSubscriptions {
        subscription {
          id
          name
          site
          price
          nextdate
        }
      }
    `;

    return from(this.nhost.graphqlRequest(query)).pipe(
      map((response: any) => response.data.subscription)
    );
  }

  // 新增訂閱
  addSubscription(subscription: Omit<Subscription, 'id'>): Observable<Subscription> {
    const mutation = `
      mutation AddSubscription($name: String!, $site: String!, $price: Int!, $nextdate: timestamp!) {
        insert_subscription_one(object: {
          name: $name,
          site: $site,
          price: $price,
          nextdate: $nextdate
        }) {
          id
          name
          site
          price
          nextdate
        }
      }
    `;

    return from(this.nhost.graphqlRequest(mutation, subscription)).pipe(
      map((response: any) => response.data.insert_subscription_one)
    );
  }

  // 更新訂閱
  updateSubscription(id: string, subscription: Partial<Subscription>): Observable<Subscription> {
    const mutation = `
      mutation UpdateSubscription($id: uuid!, $name: String, $site: String, $price: Int, $nextdate: timestamp) {
        update_subscription_by_pk(pk_columns: {id: $id}, _set: {
          name: $name,
          site: $site,
          price: $price,
          nextdate: $nextdate
        }) {
          id
          name
          site
          price
          nextdate
        }
      }
    `;

    return from(this.nhost.graphqlRequest(mutation, { id, ...subscription })).pipe(
      map((response: any) => response.data.update_subscription_by_pk)
    );
  }

  // 刪除訂閱
  deleteSubscription(id: string): Observable<boolean> {
    const mutation = `
      mutation DeleteSubscription($id: uuid!) {
        delete_subscription_by_pk(id: $id) {
          id
        }
      }
    `;

    return from(this.nhost.graphqlRequest(mutation, { id })).pipe(
      map((response: any) => !!response.data.delete_subscription_by_pk)
    );
  }

  // 計算總月費
  getTotalMonthlyFee(subscriptions: Subscription[]): number {
    return subscriptions.reduce((total, sub) => total + sub.price, 0);
  }

  // 獲取即將到期的訂閱（預設7天內）
  getUpcomingSubscriptions(subscriptions: Subscription[], days: number = 7): Subscription[] {
    const today = new Date();
    const targetDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return subscriptions.filter(sub => {
      const nextDate = new Date(sub.nextdate);
      return nextDate >= today && nextDate <= targetDate;
    });
  }
}