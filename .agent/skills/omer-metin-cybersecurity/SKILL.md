# Omer Metin Cybersecurity Skill

> Specialized expertise in elite authentication isolation, Supabase security auditing, and professional-grade defense-in-depth patterns.

---

## 🎯 Core Principles

1. **Authentication Isolation**: Never reuse public authentication endpoints for administrative access.
2. **Role Hijacking Prevention**: Ensure that role checks are multi-layered (e.g., identity + dedicated role table).
3. **Database Guarding**: Row Level Security (RLS) is the final line of defense. Every table must have a default-deny policy.
4. **Information Leakage Suppression**: Treat error messages as potential leaks. Standardize on generic failure messages for public endpoints.

## 🛠️ Security Checklist (Omer Metin Standard)

### 1. Admin Access Isolation
- [ ] Move administrative login to a cryptographically secure, non-predictable URL.
- [ ] Block the `admin` role explicitly from public login links.
- [ ] Implement short-lived session tokens for administrative actions.

### 2. Supabase / Database Hardening
- [ ] Audit every `create policy` in migration files.
- [ ] Verify that `service_role` key is NEVER used in the frontend.
- [ ] Ensure `profiles` table does not leak sensitive metadata to other users.

### 3. Application-Level Security
- [ ] Sanitize all inputs (XSS prevention).
- [ ] Use `dangerouslySetInnerHTML` only as a last resort and with heavy sanitization.
- [ ] Implement CSRF protection for all mutating endpoints.

---

## 🚦 Recommended Scripts

Run these scripts to verify adherence to the Omer Metin standard:

- `python .agent/scripts/security_scan.py .`
- `python .agent/scripts/checklist.py .`

---

> **Note**: This skill is a "Living Security Protocol". Always update it with findings from the latest security audits.
