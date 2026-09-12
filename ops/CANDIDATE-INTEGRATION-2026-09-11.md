# Candidate integration preparation, 2026-09-11

The publication candidate retains the c7ebbae source corrections and pins the final reviewed Obligation-First candidate 7f032fc5482b34359770bc50ca6fa94c6606e6fb. That candidate preserves the accepted migration self-comparison rejection, sunset diagnostic, owner-base selection and isolated projection validation with pinned owner history. The comparison base remains main 8d8c7913d2015c05ea133f0846c3472807b68005, not a commit from another owner.

PR and push checks use their explicit event bases; manual validation requires comparison_base. The resolver verifies a full SHA, owner ancestry and inequality to HEAD before canonical CI. The negative package-admission fixture now selects its own synthetic repository base instead of inheriting the production SHA; the unadmitted-mutation rejection remains required.

The correction branch is prepared for draft PR review. Moffatt, Mitchell, Matos and Swanson decisions, historical review debt and source-access limits remain open as described in ROADMAP.md and INTENT.md. Parks and Murphy corrections remain source-consistency reviews, not human or production acceptance. The current projection contains 333 records; the combined working-tree federation contains 1,061 records and 66 cross-host anchors.

Release 0.4.2 remains an unpublished source candidate. Main merge and its automatic Pages deployment, package/tag/Registry publication, paid calls and customer dispatch are held. The final private cross-owner candidate tuple and CI receipt belong to EveryAILaw; candidate success does not replace the production federation gate.
