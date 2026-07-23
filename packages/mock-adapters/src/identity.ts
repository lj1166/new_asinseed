export interface MockSession {
  userId: string;
  email: string;
}

export interface IdentityAdapter {
  getSession(req: Request): Promise<MockSession | null>;
}

const FIXED_SESSION: MockSession = { userId: "mock-user-1", email: "mock-user@example.com" };

export class MockIdentityAdapter implements IdentityAdapter {
  async getSession(_req: Request): Promise<MockSession | null> {
    return FIXED_SESSION;
  }
}
