# Imagine API scripts (ABC Adventure)

Shared auth: [`imagine_auth.py`](imagine_auth.py)

1. `XAI_API_KEY` (QA box — via QAsupervisor secret; never paste in chat)
2. `$HOME/.grok/auth.json` (OIDC JWT)
3. `/root/.grok/auth.json` (OIDC JWT — Builder machine)

| Script | Role |
|---|---|
| `imagine-api-t2i.py` | Text → image (`grok-imagine-image`) |
| `imagine-api-i2i.py` | Edit / I2I look-lock (`/v1/images/edits`, ≤5 refs) |
| `imagine-api-i2v.py` | Still → video (`grok-imagine-video-1.5`) |
| `imagine-i2v-api.sh` | Same I2V via shell + `XAI_API_KEY` |

No product generate until Ash **go** after the key lands.
