# Incident Gate — Build Decisions

## 2026-09-30 / Implementation session

### Foundation and data boundary

**DECISION**  
Use four Next.js App Router routes inside one shared operational shell, with typed simulated incident data outside presentation components.

**WHY**  
Direct routes preserve refresh behavior, mirror the four approved workflow states, and keep presentation separate from incident data and later gate logic.

**ALTERNATIVE REJECTED**  
A single large client component with transient step state, because refreshes would lose workflow location and mix unrelated responsibilities.

**IMPACT**  
The UI can stay close to the approved mockup while evidence, AI assistance, and deterministic decision logic remain independently testable.

### Security telemetry

**DECISION**  
Use only the Packet-approved invented Microsoft 365 / Defender-style telemetry and label it visibly as simulated.

**WHY**  
The approved working slice does not require a live Microsoft tenant, and no external security API should be added without a demonstrated assignment requirement.

**ALTERNATIVE REJECTED**  
Adding an unapproved external security service or assuming a free tier.

**IMPACT**  
No tenant credentials, real incident data, or security-vendor dependency is introduced.

### LLM boundary

**DECISION**  
Keep the deterministic fallback for reliability, while requiring a real server-side LLM API connection before the final deployment.

**WHY**  
The core decision boundary must survive API failure, but the final Dragon Stack must genuinely include an LLM.

**ALTERNATIVE REJECTED**  
Presenting fallback copy as live AI or allowing model output to control authorization.

**IMPACT**  
The final deployment will need a server-only API key; the gate result will remain outside the LLM boundary.

### NEXT FIRST MOVE

Complete and verify the approved Incident Intake and Evidence Review screens.
