# Orchestrator Continue - Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/continue.yaml</critical>
<critical>Communicate in {communication_language} as ownuun persona</critical>

<workflow>

<step n="1" goal="Read workflow status file">
  <action>Read {workflow_status_file}</action>

  <check if="file not found">
    <output>❌ 워크플로우 상태 파일이 없습니다.</output>
    <output>먼저 `*start` 명령어로 프로젝트를 초기화해주세요.</output>
    <action>Exit workflow</action>
  </check>

  <action>Parse YAML structure</action>
  <action>Extract workflow_status array</action>
  <action>Identify current phase and workflows</action>
</step>

<step n="2" goal="Find next workflow to execute">
  <action>Scan workflow_status for next pending workflow</action>

  <logic>
    Priority order:
    1. First workflow with status: "required" (not file path or "skipped")
    2. First workflow with status: "recommended" (not file path or "skipped")
    3. First workflow with status: "optional" (ask user)
    4. First workflow with status: "conditional" (check condition, ask if needed)
  </logic>

  <check if="found required workflow">
    <output>다음 필수 워크플로우: {{workflow_id}}</output>
    <output>설명: {{workflow_description}}</output>
    <output>에이전트: {{workflow_agent}}</output>
    <action>Store next_workflow_command = {{workflow_command}}</action>
    <action>Store next_workflow_id = {{workflow_id}}</action>
    <action>Continue to step 3</action>
  </check>

  <check if="found recommended workflow">
    <output>다음 권장 워크플로우: {{workflow_id}}</output>
    <ask>진행하시겠습니까? [y/n]</ask>
    <action if="y">Store next_workflow_command and continue to step 3</action>
    <action if="n">Mark as skipped, repeat step 2 for next workflow</action>
  </check>

  <check if="found optional workflow">
    <output>선택적 워크플로우: {{workflow_id}}</output>
    <ask>진행하시겠습니까? [y/n]</ask>
    <action if="y">Store next_workflow_command and continue to step 3</action>
    <action if="n">Mark as skipped, repeat step 2 for next workflow</action>
  </check>

  <check if="no pending workflows">
    <output>🎉 모든 워크플로우가 완료되었습니다!</output>
    <action>Show final summary</action>
    <action>Exit workflow</action>
  </check>
</step>

<step n="3" goal="Execute next workflow">
  <output>워크플로우 실행 중: {{next_workflow_id}}</output>
  <output>명령어: {{next_workflow_command}}</output>

  <action>Execute slash command: {{next_workflow_command}}</action>
  <action>Wait for workflow completion</action>

  <check if="workflow completed successfully">
    <output>✅ 워크플로우 완료: {{next_workflow_id}}</output>
    <action>Continue to step 4</action>
  </check>

  <check if="workflow failed or user cancelled">
    <output>⚠️ 워크플로우가 중단되었습니다.</output>
    <ask>다시 시도하시겠습니까? [y/n]</ask>
    <action if="y">Jump back to step 3</action>
    <action if="n">Exit workflow</action>
  </check>
</step>

<step n="4" goal="Run Party-mode automatic review">
  <output>품질 검증을 위해 Party-mode 리뷰를 시작합니다...</output>

  <action>Invoke party-mode: {project-root}/.bmad/core/workflows/party-mode/workflow.yaml</action>
  <action>Pass context: "Review output from {{next_workflow_id}}"</action>
  <action>Wait for party-mode completion</action>

  <output>✅ Party-mode 리뷰 완료</output>

  <ask>리뷰 결과:
  {{party_mode_summary}}

  계속 진행하시겠습니까? [y/n]</ask>

  <action if="y">Continue to step 5</action>
  <action if="n">
    <output>워크플로우를 일시 정지합니다.</output>
    <output>다시 시작하려면 `*continue`를 실행하세요.</output>
    <action>Exit workflow</action>
  </action>
</step>

<step n="5" goal="Update workflow status">
  <action>Read {workflow_status_file}</action>
  <action>Find workflow with id: {{next_workflow_id}}</action>
  <action>Determine output file path from completed workflow</action>
  <action>Update status from "required"/"optional" to file path</action>
  <action>Save updated {workflow_status_file}</action>

  <output>상태 파일 업데이트 완료</output>
</step>

<step n="6" goal="Check if more workflows remain">
  <action>Scan workflow_status for remaining pending workflows</action>

  <check if="more workflows pending">
    <ask>다음 워크플로우를 계속 진행하시겠습니까?

    [c] Continue - 다음 워크플로우 실행
    [s] Status - 진행 상황 확인
    [x] Exit - 나중에 계속
    </ask>

    <action if="c">Jump back to step 2</action>
    <action if="s">Invoke status workflow then return here</action>
    <action if="x">
      <output>진행을 일시 정지합니다. `*continue`로 재개하세요.</output>
      <action>Exit workflow</action>
    </action>
  </check>

  <check if="no more workflows">
    <output>🎉 축하합니다! 모든 워크플로우가 완료되었습니다!</output>
    <action>Invoke status workflow to show final summary</action>
    <action>Exit workflow</action>
  </check>
</step>

</workflow>
