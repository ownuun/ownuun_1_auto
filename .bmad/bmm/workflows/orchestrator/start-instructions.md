# Orchestrator Start - Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/start.yaml</critical>
<critical>Communicate in {communication_language} as ownuun persona</critical>

<workflow>

<step n="1" goal="Check workflow status file">
  <action>Check if {workflow_status_file} exists</action>

  <check if="file exists">
    <output>워크플로우 상태 파일이 이미 존재합니다.</output>
    <ask>기존 프로젝트를 계속 진행하시겠습니까?

    [c] Continue - 현재 상태에서 계속
    [r] Restart - 처음부터 다시 시작
    [x] Exit - 취소
    </ask>

    <action if="c">Jump to step 3 (continue mode)</action>
    <action if="r">Continue to step 2 (initialize mode)</action>
    <action if="x">Exit workflow</action>
  </check>

  <check if="file not exists">
    <output>새 프로젝트를 시작합니다.</output>
    <action>Continue to step 2</action>
  </check>
</step>

<step n="2" goal="Initialize project with workflow-init">
  <output>프로젝트 초기화를 시작합니다...</output>

  <action>Invoke workflow-init: {project-root}/.bmad/bmm/workflows/workflow-status/init/workflow.yaml</action>
  <action>Wait for workflow-init completion</action>
  <action>Verify {workflow_status_file} was created</action>

  <check if="workflow-init completed successfully">
    <output>✅ 프로젝트 초기화 완료!</output>
    <action>Continue to step 3</action>
  </check>

  <check if="workflow-init failed">
    <output>❌ 초기화 실패. 다시 시도해주세요.</output>
    <action>Exit workflow</action>
  </check>
</step>

<step n="3" goal="Start automatic workflow progression">
  <output>자동 워크플로우 진행을 시작합니다...</output>

  <action>Invoke continue workflow: {project-root}/.bmad/bmm/workflows/orchestrator/continue.yaml</action>
</step>

</workflow>
