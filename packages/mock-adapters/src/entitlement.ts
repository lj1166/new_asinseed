export interface MockPlan {
  plan: "free" | "pro";
  queryQuota: number;
}

export interface EntitlementAdapter {
  getPlan(userId: string): Promise<MockPlan>;
}

const FIXED_PLAN: MockPlan = { plan: "free", queryQuota: 10 };

export class MockEntitlementAdapter implements EntitlementAdapter {
  async getPlan(_userId: string): Promise<MockPlan> {
    return FIXED_PLAN;
  }
}
