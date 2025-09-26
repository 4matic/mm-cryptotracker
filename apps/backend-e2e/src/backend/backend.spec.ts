import axios from 'axios';

describe('GET /api', () => {
  it('should return swagger page with title "Swagger UI"', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.data).toContain('<title>Swagger UI</title>');
  });
});
