# Orchestrator Rollback - Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/rollback.yaml</critical>
<critical>Communicate in {communication_language} as ownuun persona</critical>
<critical>⚠️ 이것은 Moonshot 기능입니다 - 추후 구현 예정</critical>

<workflow>

<step n="1" goal="Check rollback availability">
  <output>⚠️ Rollback 기능은 현재 개발 중입니다 (Moonshot 기능)</output>

  <action>Read {workflow_status_file}</action>

  <check if="file not found">
    <output>❌ 워크플로우 상태 파일이 없습니다.</output>
    <action>Exit workflow</action>
  </check>

  <action>Parse completed workflows</action>
  <action>Check if {backup_folder} exists</action>
</step>

<step n="2" goal="Show completed workflows">
  <output>완료된 워크플로우 목록:</output>

  <action>List all workflows with status = file path (completed)</action>
  <action>Number them for selection</action>

  <check if="no completed workflows">
    <output>롤백할 완료된 워크플로우가 없습니다.</output>
    <action>Exit workflow</action>
  </check>

  <output>
{{#each completed_workflow}}
{{index}}. {{workflow_id}}
   완료 시간: {{completion_time}}
   결과물: {{output_file}}
{{/each}}
</output>

  <ask>어떤 워크플로우로 롤백하시겠습니까? (번호 입력 또는 'cancel')</ask>
</step>

<step n="3" goal="Confirm rollback">
  <output>⚠️ 경고: 롤백하면 다음 작업들이 취소됩니다:</output>

  <action>List all workflows completed AFTER the selected rollback point</action>

  <ask>정말로 롤백하시겠습니까? [y/n]</ask>

  <action if="n">
    <output>롤백을 취소했습니다.</output>
    <action>Exit workflow</action>
  </action>
</step>

<step n="4" goal="Perform rollback (Future Implementation)">
  <output>🚧 롤백 기능은 추후 구현 예정입니다.</output>

  <output>구현 계획:
  1. 각 워크플로우 완료 후 자동 백업
  2. 백업 파일 버전 관리
  3. 선택한 시점으로 상태 복원
  4. 관련 아티팩트 파일 복원
  </output>

  <output>현재는 수동으로 다음 작업을 수행해야 합니다:
  1. 해당 워크플로우 결과물 삭제
  2. 상태 파일에서 status를 "required"로 변경
  3. `*continue`로 다시 실행
  </output>
</step>

</workflow>
