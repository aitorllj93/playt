---
name: team_standup_report
version: 1.0
description: Generates team standup report with progress analysis
tags: ["team", "standup", "agile", "report"]

variables:
  team_name:
    type: string
    required: true
    description: Team name

  date:
    type: string
    required: true
    description: Standup date (YYYY-MM-DD)

  sprint_number:
    type: number
    required: true
    description: Current sprint number

  team_members:
    type: array
    required: true
    description: List of team members with their updates

  blockers:
    type: array
    required: false
    default: []
    description: List of team impediments

  upcoming_deadlines:
    type: array
    required: false
    default: []
    description: Upcoming important deadlines

output:
  format: markdown
---

# Daily Standup Report - {{ team_name }}

**Date:** {{ date }}
**Sprint:** #{{ sprint_number }}

Generate a comprehensive standup report summarizing the team's progress, blockers, and next steps.

---

## Team Updates

{% for member in team_members %}
### {{ member.name }} ({{ member.role }})

**Yesterday:**
{% for task in member.completed %}
- ✅ {{ task }}
{% endfor %}

**Today:**
{% for task in member.planned %}
- 🎯 {{ task }}
{% endfor %}

{% if member.blockers %}
**Blockers:**
{% for blocker in member.blockers %}
- 🚧 {{ blocker }}
{% endfor %}
{% endif %}

{% if member.notes %}
**Notes:** {{ member.notes }}
{% endif %}

---
{% endfor %}

## Team Blockers

{% if blockers %}
The following blockers need attention:

{% for blocker in blockers %}
### {{ blocker.title }}
- **Severity:** {{ blocker.severity }}
- **Affected:** {{ blocker.affected_members | join(", ") }}
- **Description:** {{ blocker.description }}
- **Proposed Solution:** {{ blocker.solution }}
{% endfor %}
{% else %}
✨ No blockers reported - team is running smoothly!
{% endif %}

## Upcoming Deadlines

{% if upcoming_deadlines %}
{% for deadline in upcoming_deadlines %}
- **{{ deadline.date }}**: {{ deadline.milestone }} ({{ deadline.status }})
  - Owner: {{ deadline.owner }}
  - Progress: {{ deadline.progress }}%
{% endfor %}
{% else %}
No immediate deadlines this week.
{% endif %}

---

## Analysis Request

Based on the above information, provide:

1. **Team Velocity Assessment**
   - Are we on track for sprint goals?
   - Any concerns about workload distribution?

2. **Blocker Resolution**
   - Prioritize blockers by impact
   - Suggest action items for resolution

3. **Risk Analysis**
   - Identify potential risks from the updates
   - Highlight dependencies between team members

4. **Recommendations**
   - Suggest schedule adjustments if needed
   - Identify opportunities for collaboration
   - Flag items that need management attention

5. **Morale Check**
   - Assess team sentiment from the updates
   - Identify team members who might need support

Generate a concise executive summary suitable for management review.

