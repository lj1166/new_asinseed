# 真实后端对接报告模板

> 仅在人工批准 Mock → 真实 Legacy Adapter 切换后复制为 `legacy-contract-report.md` 使用。
> 本模板不是 API 目录；未知项必须填写 `UNRESOLVED`，不得猜测或预填真实 URL、认证方式、超时和错误码。

## Scope And Approval

| Field | Value |
|---|---|
| Approved by | `UNRESOLVED` |
| Approval date | `UNRESOLVED` |
| Target environment | `UNRESOLVED` |
| In-scope capability | `UNRESOLVED` |
| Out of scope | `UNRESOLVED` |

## Evidence Sources

| Source | Location / owner | What it proves | Status |
|---|---|---|---|
| Legacy Controller / client | `UNRESOLVED` | route and request shape | `UNRESOLVED` |
| Approved API documentation | `UNRESOLVED` | contract and environment | `UNRESOLVED` |
| Backend owner confirmation | `UNRESOLVED` | authentication ownership | `UNRESOLVED` |
| Captured non-production response | `UNRESOLVED` | success / failure shape | `UNRESOLVED` |

## Interface Mapping

| Capability | New provider method | Legacy / real route | Method | Request mapping | Response mapping | Evidence | Status |
|---|---|---|---|---|---|---|---|
| `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` |

## Authentication And Secret Boundary

| Item | Decision / evidence | Status |
|---|---|---|
| Calling identity and grant | `UNRESOLVED` | `UNRESOLVED` |
| Secret storage | Server environment variable or approved secret platform only | required |
| Browser / Sanity exposure | prohibited | required |
| Rotation / expiry owner | `UNRESOLVED` | `UNRESOLVED` |

## Failure Samples

| Scenario | HTTP / provider result | User-facing handling | Evidence | Status |
|---|---|---|---|---|
| Success | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` |
| Invalid input | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` |
| Unauthorized / unavailable | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` | `UNRESOLVED` |

## Exit Check

- [ ] Human approval is recorded.
- [ ] Every implemented mapping has traceable evidence.
- [ ] No `UNRESOLVED` item is implemented in a real adapter.
- [ ] Secret boundary is confirmed and no secret appears in code, browser or Sanity content.
- [ ] Tests cover at least one confirmed success and one confirmed failure response.
