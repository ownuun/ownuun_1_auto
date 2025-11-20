# Orchestrator Status - Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/status.yaml</critical>
<critical>Communicate in {communication_language} as ownuun persona</critical>

<workflow>

<step n="1" goal="Read and parse workflow status">
  <action>Read {workflow_status_file}</action>

  <check if="file not found">
    <output>❌ 워크플로우 상태 파일이 없습니다.</output>
    <output>먼저 `*start` 명령어로 프로젝트를 초기화해주세요.</output>
    <action>Exit workflow</action>
  </check>

  <action>Parse YAML structure</action>
  <action>Extract project metadata</action>
  <action>Extract workflow_status array</action>
</step>

<step n="2" goal="Calculate progress statistics">
  <action>Count total workflows across all phases</action>
  <action>Count completed workflows (status = file path)</action>
  <action>Count skipped workflows (status = "skipped")</action>
  <action>Count pending workflows (status = "required"/"optional"/"recommended"/"conditional")</action>
  <action>Calculate completion percentage</action>

  <action>Group workflows by phase (0, 1, 2, 3)</action>
  <action>Calculate per-phase completion</action>
</step>

<step n="3" goal="Display progress dashboard">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 프로젝트 진행 상황 대시보드
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**프로젝트:** {{project_name}}
**트랙:** {{selected_track}}
**타입:** {{field_type}}

**전체 진행률:** {{completion_percentage}}% ({{completed_count}}/{{total_count}})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

  <action>For each phase in workflow_status:</action>
  <output>
### Phase {{phase_number}}: {{phase_name}}

{{#each workflows in phase}}
- [{{status_icon}}] {{workflow_id}}
  {{workflow_description}}
  {{#if completed}}✅ 완료: {{output_file}}{{/if}}
  {{#if pending}}⏳ 대기 중{{/if}}
  {{#if skipped}}⏭️ 건너뜀{{/if}}
{{/each}}

Phase {{phase_number}} 진행률: {{phase_completion}}%

</output>
</step>

<step n="4" goal="Show next action">
  <action>Identify next pending workflow</action>

  <check if="next workflow found">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**다음 단계:** {{next_workflow_id}}
**설명:** {{next_workflow_description}}
**명령어:** {{next_workflow_command}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 `*continue`를 실행하여 자동으로 진행하세요.
</output>
  </check>

  <check if="all completed">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 축하합니다! 모든 워크플로우가 완료되었습니다!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
  </check>
</step>

</workflow>
