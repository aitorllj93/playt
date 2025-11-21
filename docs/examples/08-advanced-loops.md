# Example 8: Advanced Loops

Template demonstrating advanced iteration with arrays and objects.

## File: team-standup-report.md

```markdown
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
```

## Usage

```javascript
import { render } from 'playt';

const standupData = {
  team_name: 'Platform Engineering',
  date: '2025-11-21',
  sprint_number: 24,
  team_members: [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineer',
      completed: [
        'Implemented user authentication API',
        'Fixed critical bug in payment flow',
        'Reviewed 3 PRs'
      ],
      planned: [
        'Complete integration tests for auth',
        'Start work on dashboard redesign'
      ],
      blockers: [],
      notes: 'Auth API ready for QA testing'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Backend Engineer',
      completed: [
        'Database migration for user profiles',
        'Optimized search queries'
      ],
      planned: [
        'Implement caching layer',
        'Performance testing'
      ],
      blockers: [
        'Waiting on DevOps for Redis cluster setup'
      ]
    },
    {
      name: 'Emma Watson',
      role: 'Frontend Engineer',
      completed: [
        'Updated component library',
        'Fixed responsive issues on mobile'
      ],
      planned: [
        'Implement new design system',
        'Work on accessibility improvements'
      ],
      blockers: []
    }
  ],
  blockers: [
    {
      title: 'Redis Cluster Not Available',
      severity: 'Medium',
      affected_members: ['Mike Rodriguez'],
      description: 'Backend team needs Redis cluster for caching implementation but DevOps hasn\'t provisioned it yet',
      solution: 'Escalate to DevOps manager, consider using single Redis instance temporarily'
    }
  ],
  upcoming_deadlines: [
    {
      date: '2025-11-25',
      milestone: 'Authentication System Complete',
      status: 'On Track',
      owner: 'Sarah Chen',
      progress: 85
    },
    {
      date: '2025-11-30',
      milestone: 'Performance Optimization Sprint',
      status: 'At Risk',
      owner: 'Mike Rodriguez',
      progress: 45
    }
  ]
};

const prompt = await render('team-standup-report.md', standupData);

// Send to AI for analysis
const analysis = await ai.complete(prompt);
console.log(analysis);
```

## Result

```markdown
# Daily Standup Report - Platform Engineering

**Date:** 2025-11-21
**Sprint:** #24

Generate a comprehensive standup report summarizing the team's progress, blockers, and next steps.

---

## Team Updates

### Sarah Chen (Senior Engineer)

**Yesterday:**
- ✅ Implemented user authentication API
- ✅ Fixed critical bug in payment flow
- ✅ Reviewed 3 PRs

**Today:**
- 🎯 Complete integration tests for auth
- 🎯 Start work on dashboard redesign

**Notes:** Auth API ready for QA testing

---

### Mike Rodriguez (Backend Engineer)

**Yesterday:**
- ✅ Database migration for user profiles
- ✅ Optimized search queries

**Today:**
- 🎯 Implement caching layer
- 🎯 Performance testing

**Blockers:**
- 🚧 Waiting on DevOps for Redis cluster setup

---

### Emma Watson (Frontend Engineer)

**Yesterday:**
- ✅ Updated component library
- ✅ Fixed responsive issues on mobile

**Today:**
- 🎯 Implement new design system
- 🎯 Work on accessibility improvements

---

## Team Blockers

The following blockers need attention:

### Redis Cluster Not Available
- **Severity:** Medium
- **Affected:** Mike Rodriguez
- **Description:** Backend team needs Redis cluster for caching implementation but DevOps hasn't provisioned it yet
- **Proposed Solution:** Escalate to DevOps manager, consider using single Redis instance temporarily

## Upcoming Deadlines

- **2025-11-25**: Authentication System Complete (On Track)
  - Owner: Sarah Chen
  - Progress: 85%
- **2025-11-30**: Performance Optimization Sprint (At Risk)
  - Owner: Mike Rodriguez
  - Progress: 45%

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
```

## Features

- ✅ Nested loops (`{% for %}`)
- ✅ Complex object arrays
- ✅ Conditionals within loops
- ✅ `join` filter for arrays
- ✅ Object property access
- ✅ Conditional loops (only if data exists)
- ✅ Dynamic formatting based on data

## Variations

### Simplified Version

```javascript
// For simpler standups
const simpleData = {
  team_name: 'Mobile Team',
  date: '2025-11-21',
  sprint_number: 12,
  team_members: [
    {
      name: 'Alex',
      role: 'iOS Dev',
      completed: ['Fixed login bug'],
      planned: ['Add dark mode']
    }
  ]
};
```

### With More Metrics

```javascript
// Add sprint metrics
const dataWithMetrics = {
  ...standupData,
  sprint_metrics: {
    story_points_completed: 23,
    story_points_planned: 35,
    velocity_trend: 'increasing',
    bugs_fixed: 8,
    bugs_opened: 3
  }
};
```
