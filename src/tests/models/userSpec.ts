import { CreateUser, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('User Model', () => {
  const testUser: CreateUser = {
    firstname: 'Kane',
    lastname: 'Schoenfeld',
    username: 'kaneschoenfeld',
    password: 'password123',
  };
  let testUserId = 0;

  it('should create user', async () => {
    const createdUser = await userStore.create(testUser);
    expect(createdUser.username).toBe(testUser.username);
    expect(createdUser.firstname).toBe(testUser.firstname);
    expect(createdUser.lastname).toBe(testUser.lastname);
    testUserId = createdUser.id;
  });

  it('should get all users', async () => {
    const users = await userStore.index();
    expect(users.length).toBeGreaterThan(0);
  });

  it('should get user', async () => {
    const user = await userStore.show(testUserId);
    expect(user.id).toBe(testUserId);
    expect(user.username).toBe(testUser.username);
    expect(user.firstname).toBe(testUser.firstname);
    expect(user.lastname).toBe(testUser.lastname);
  });

  it('should update user', async () => {
    const user = await userStore.update(testUserId, {
      firstname: 'Kane',
      lastname: 'Schoenfald',
    });
    expect(user.id).toBe(testUserId);
    expect(user.username).toBe(testUser.username);
    expect(user.firstname).toBe('Kane');
    expect(user.lastname).toBe('Schoenfald');
  });

  it('should authenticate user', async () => {
    const user = await userStore.authenticate(
      testUser.username,
      testUser.password
    );
    expect(user).toBeDefined();
  });

  it('should delete user', async () => {
    const success = await userStore.delete(testUserId);
    expect(success).toBeTrue();
  });
});
