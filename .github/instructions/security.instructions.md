---
applyTo: "**"
---

- When implmenting authentication, use JWT tokens for stateless authentication.
- Never store sensitive information (like passwords) in plain text, always hash them using a strong hashing algorithm (e.g., bcrypt).
- Always implement authentication with proper session management, including token expiration and refresh mechanisms.
- The authentication middleware should validate the JWT token and extract user information from it.
- Use role-based access control (RBAC) to manage permissions and restrict access to resources based on user roles.
- Always validate user input to prevent common security vulnerabilities such as SQL injection, XSS, and CSRF.
- Authentication endpoints should return both access and refresh tokens upon successful login:
```json
{
  "access_token": "your_access_token",
  "refresh_token": "your_refresh_token"
}
```
- Always implement `me` endpoint to allow users to retrieve their own profile information.
