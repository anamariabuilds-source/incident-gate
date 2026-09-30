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

### Deterministic action boundary

**DECISION**
Implement the Reversibility Gate as a pure function that accepts only four allow-listed condition states and permits progress only when every state is `YES`.

**WHY**
`NO`, `UNKNOWN`, and `UNVERIFIED` must all reduce authority and produce human escalation.

**ALTERNATIVE REJECTED**
Passing AI prose, confidence, or recommendations into the authorization decision.

**IMPACT**
The approved demo result is stable, auditable, and testable even when the LLM is unavailable or produces unexpected text.

### Deployment 1

**DECISION**
Create the first production deployment immediately after Commit 3 and preserve its immutable identifier.

**WHY**
This records the approved core workflow through the Reversibility Gate before packet and usability corrections.

**ALTERNATIVE REJECTED**
Collapsing the core checkpoint into the final deployment.

**IMPACT**
Deployment `dpl_58Pp3dbbL7G7isKEspwLKMXvzh6L` is available at `https://incident-gate-6kysdimko-anamaria-builds.vercel.app`; the public production alias is `https://incident-gate.vercel.app`. The first CLI attempt failed because Vercel derived an invalid name from the local folder, then succeeded with the explicit project name `incident-gate`.

### Mechanical test bug

**EXPECTED**
The interface must enforce Reporte → Evidencia → Evaluación → Escalación and never expose a direct Alert → Action path.

**ACTUAL**
Every item in the top progress indicator was a link. From the initial report, Carlos could select “3. Evaluación” and reach the proposed action without reviewing evidence.

**REPRODUCTION STEPS**
Open the deployed root URL and select “3. Evaluación” in the top navigation.

**CAUSE**
The shared shell rendered all workflow steps as unrestricted Next.js links regardless of current progress.

**FIX**
Render future and current steps as non-interactive progress labels; expose links only for previously completed steps. Forward movement remains available only through each screen’s approved primary CTA.

**RETEST RESULT**
Passed. Eight automated tests, lint, type checking, and the production build succeeded. Preview deployment `dpl_HMdeGvF1WFU336CfMFVNfxqtmRbb` exposed no direct `/evaluacion` or `/escalacion` link from Reporte, rendered three future steps as locked, and retained the approved `/evidencia` CTA.

### NEXT FIRST MOVE

Retest the mechanical navigation fix, capture Persona Test screenshots in workflow order, and stop for the Persona Test findings.
