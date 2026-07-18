"""add_workflow_fields_to_projects

Revision ID: 0002_workflow_fields
Revises: 0001_initial_schema
Create Date: 2026-07-18

Adds workflow stage/handoff columns to the projects table:
- niche         VARCHAR(100)
- format        VARCHAR(100)
- team_mode     VARCHAR(50)  NOT NULL DEFAULT 'solo'
- workflow_profile VARCHAR(100) NOT NULL DEFAULT 'Standard Production'
- current_stage VARCHAR(50)  NOT NULL DEFAULT 'Strategy'
- workflow_stages JSONB
- project_metadata JSONB
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers
revision = "0002_workflow_fields"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "projects",
        sa.Column("niche", sa.String(length=100), nullable=True),
    )
    op.add_column(
        "projects",
        sa.Column("format", sa.String(length=100), nullable=True),
    )
    op.add_column(
        "projects",
        sa.Column(
            "team_mode",
            sa.String(length=50),
            nullable=False,
            server_default="solo",
        ),
    )
    op.add_column(
        "projects",
        sa.Column(
            "workflow_profile",
            sa.String(length=100),
            nullable=False,
            server_default="Standard Production",
        ),
    )
    op.add_column(
        "projects",
        sa.Column(
            "current_stage",
            sa.String(length=50),
            nullable=False,
            server_default="Strategy",
        ),
    )
    op.add_column(
        "projects",
        sa.Column("workflow_stages", JSONB, nullable=True),
    )
    op.add_column(
        "projects",
        sa.Column("project_metadata", JSONB, nullable=True),
    )


def downgrade() -> None:
    op.drop_column("projects", "project_metadata")
    op.drop_column("projects", "workflow_stages")
    op.drop_column("projects", "current_stage")
    op.drop_column("projects", "workflow_profile")
    op.drop_column("projects", "team_mode")
    op.drop_column("projects", "format")
    op.drop_column("projects", "niche")
