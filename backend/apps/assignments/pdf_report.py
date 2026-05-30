"""
Workforce PDF Report — clean black & white A4 layout.
GET /api/workforce-report/?from_date=YYYY-MM-DD&to_date=YYYY-MM-DD&buildings=1,2,3
"""

import io
import os
from datetime import date, datetime

from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, Image,
)

from .models import WorkSession, WorkDetail
from apps.buildings.models import Building


# ── date helpers ──────────────────────────────────────────────────────────────
def _fmt(d) -> str:
    if isinstance(d, str):
        d = date.fromisoformat(d)
    return d.strftime("%d/%m/%Y")

def _fmt_file(d) -> str:
    if isinstance(d, str):
        d = date.fromisoformat(d)
    return d.strftime("%d-%m-%Y")


# ── shared colours ─────────────────────────────────────────────────────────────
BLACK = colors.black
WHITE = colors.white
GREY  = colors.HexColor("#E0E0E0")   # light border grey


# ── paragraph styles ──────────────────────────────────────────────────────────
def _make_styles():
    return {
        # ── company header ──
        "company": ParagraphStyle(
            "company",
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            alignment=TA_CENTER,
            textColor=BLACK,
            spaceAfter=2,
        ),
        "report_title": ParagraphStyle(
            "report_title",
            fontName="Helvetica",
            fontSize=12,
            leading=15,
            alignment=TA_CENTER,
            textColor=BLACK,
            spaceAfter=4,
        ),
        "period": ParagraphStyle(
            "period",
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            alignment=TA_CENTER,
            textColor=BLACK,
            spaceAfter=0,
        ),
        # ── building heading ──
        "building_name": ParagraphStyle(
            "building_name",
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            alignment=TA_LEFT,
            textColor=BLACK,
            spaceBefore=14,
            spaceAfter=4,
        ),
        # ── date within building ──
        "date_line": ParagraphStyle(
            "date_line",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            alignment=TA_LEFT,
            textColor=BLACK,
            spaceBefore=8,
            spaceAfter=3,
        ),
        # ── table cell — category ──
        "cell_label": ParagraphStyle(
            "cell_label",
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            alignment=TA_LEFT,
            textColor=BLACK,
        ),
        # ── table cell — count ──
        "cell_count": ParagraphStyle(
            "cell_count",
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            alignment=TA_RIGHT,
            textColor=BLACK,
        ),
        # ── daily total ──
        "daily_total": ParagraphStyle(
            "daily_total",
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            alignment=TA_RIGHT,
            textColor=BLACK,
        ),
        # ── building total ──
        "building_total": ParagraphStyle(
            "building_total",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            alignment=TA_RIGHT,
            textColor=BLACK,
            spaceBefore=4,
            spaceAfter=6,
        ),
        # ── overall section heading ──
        "overall_heading": ParagraphStyle(
            "overall_heading",
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            alignment=TA_LEFT,
            textColor=BLACK,
            spaceBefore=14,
            spaceAfter=6,
        ),
        # ── overall row ──
        "overall_label": ParagraphStyle(
            "overall_label",
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            alignment=TA_LEFT,
            textColor=BLACK,
        ),
        "overall_count": ParagraphStyle(
            "overall_count",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            alignment=TA_RIGHT,
            textColor=BLACK,
        ),
        # ── grand total ──
        "grand_total": ParagraphStyle(
            "grand_total",
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            alignment=TA_RIGHT,
            textColor=BLACK,
            spaceBefore=6,
        ),
    }


# ── PDF builder ───────────────────────────────────────────────────────────────
def generate_workforce_pdf(
    from_date: date,
    to_date: date,
    building_ids: list,
) -> io.BytesIO:

    buffer = io.BytesIO()
    W, H   = A4
    margin = 20 * mm
    usable = W - 2 * margin

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin,
        title="Workforce Report",
    )

    S     = _make_styles()
    story = []

    # ── Company + title block (text left, logo top-right) ─────────────────────
    LOGO_PATH = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "staticfiles", "assets", "logo.png"
    )

    period_str = (
        f"Period: {_fmt(from_date)} \u2014 {_fmt(to_date)}"
        f"    |    Generated: {datetime.now().strftime('%d/%m/%Y %H:%M')}"
    )

    # Left cell: company name + subtitle + period stacked
    text_cell = [
        Paragraph("E-TECH BUILDERS", S["company"]),
        Paragraph("Workforce Report", S["report_title"]),
        Spacer(1, 4),
        Paragraph(period_str, S["period"]),
    ]

    # Right cell: logo (if file exists), else empty
    LOGO_W = 28 * mm   # width of logo in the PDF
    LOGO_H = 28 * mm   # height of logo in the PDF
    if os.path.isfile(LOGO_PATH):
        logo_cell = Image(LOGO_PATH, width=LOGO_W, height=LOGO_H)
        logo_cell.hAlign = "RIGHT"
        right_col = [logo_cell]
    else:
        right_col = [Spacer(1, LOGO_H)]

    col_text  = usable - LOGO_W - 4 * mm
    col_logo  = LOGO_W + 4 * mm

    header_tbl = Table(
        [[text_cell, right_col]],
        colWidths=[col_text, col_logo],
    )
    header_tbl.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN",         (1, 0), (1, 0),   "RIGHT"),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
    ]))
    story.append(header_tbl)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1, color=BLACK, spaceAfter=6))

    # ── Fetch buildings in alphabetical order ─────────────────────────────────
    buildings = Building.objects.filter(id__in=building_ids).order_by("name")

    # overall_data: [(building_name, {category: total_count})]
    overall_data: list[tuple[str, dict]] = []

    for building in buildings:
        sessions = (
            WorkSession.objects
            .filter(
                building=building,
                work_date__gte=from_date,
                work_date__lte=to_date,
            )
            .prefetch_related("details")
            .order_by("work_date")
        )
        if not sessions.exists():
            continue

        # ── Building heading ──
        story.append(Paragraph(building.name.upper(), S["building_name"]))
        story.append(HRFlowable(width="100%", thickness=0.5, color=BLACK, spaceAfter=4))

        # Group sessions by date
        date_map: dict = {}
        for sess in sessions:
            date_map.setdefault(sess.work_date, []).append(sess)

        building_total: float = 0.0
        # Accumulate per-building category totals for the Overall Summary
        building_cat_totals: dict[str, float] = {}

        for work_date in sorted(date_map.keys()):
            # Aggregate category totals across all sessions on the same date
            cat_totals: dict[str, float] = {}
            for sess in date_map[work_date]:
                for detail in sess.details.all():
                    cat_totals[detail.category] = (
                        cat_totals.get(detail.category, 0) + float(detail.count)
                    )
                    building_cat_totals[detail.category] = (
                        building_cat_totals.get(detail.category, 0) + float(detail.count)
                    )

            day_total: float = sum(cat_totals.values())
            building_total += day_total

            # ── Date heading ──
            story.append(Paragraph(_fmt(work_date), S["date_line"]))

            # ── Two-column table: Category | Count ───────────────────────────
            col_label = usable * 0.75
            col_count = usable * 0.25

            table_data = []
            # header row
            table_data.append([
                Paragraph("Category", ParagraphStyle(
                    "hdr", fontName="Helvetica-Bold", fontSize=9,
                    alignment=TA_LEFT, textColor=BLACK
                )),
                Paragraph("Count", ParagraphStyle(
                    "hdr_r", fontName="Helvetica-Bold", fontSize=9,
                    alignment=TA_RIGHT, textColor=BLACK
                )),
            ])
            for cat in sorted(cat_totals.keys()):
                cnt = cat_totals[cat]
                table_data.append([
                    Paragraph(cat, S["cell_label"]),
                    Paragraph(f"{cnt:g}", S["cell_count"]),
                ])

            tbl = Table(table_data, colWidths=[col_label, col_count])
            tbl.setStyle(TableStyle([
                # outer border
                ("BOX",         (0, 0), (-1, -1), 0.5, BLACK),
                # inner horizontals
                ("INNERGRID",   (0, 0), (-1, -1), 0.25, BLACK),
                # header row style
                ("BACKGROUND",  (0, 0), (-1, 0), WHITE),
                ("LINEBELOW",   (0, 0), (-1, 0), 0.8, BLACK),
                # padding
                ("TOPPADDING",  (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING",(0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING",(0, 0), (-1, -1), 6),
                ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
            ]))
            story.append(tbl)
            story.append(Spacer(1, 8))

        # ── Total count in categories (per building, across all dates) ──
        story.append(Paragraph(
            "Total count in categories :",
            ParagraphStyle(
                "bld_cat_hdr",
                fontName="Helvetica-Bold",
                fontSize=10,
                leading=14,
                alignment=TA_LEFT,
                textColor=BLACK,
                spaceBefore=6,
                spaceAfter=4,
            )
        ))

        col_label_b = usable * 0.75
        col_count_b = usable * 0.25

        bld_cat_data = []
        for cat in sorted(building_cat_totals.keys()):
            cnt = building_cat_totals[cat]
            bld_cat_data.append([
                Paragraph(cat, S["cell_label"]),
                Paragraph(
                    f"{cnt:g}",
                    ParagraphStyle(
                        "bld_cnt",
                        fontName="Helvetica-Bold",
                        fontSize=9,
                        leading=12,
                        alignment=TA_RIGHT,
                        textColor=BLACK,
                    )
                ),
            ])

        if bld_cat_data:
            bld_cat_tbl = Table(bld_cat_data, colWidths=[col_label_b, col_count_b])
            bld_cat_tbl.setStyle(TableStyle([
                ("BOX",           (0, 0), (-1, -1), 0.8, BLACK),
                ("INNERGRID",     (0, 0), (-1, -1), 0.3, BLACK),
                ("TOPPADDING",    (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING",   (0, 0), (-1, -1), 6),
                ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
                ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
            ]))
            story.append(bld_cat_tbl)

        story.append(Spacer(1, 16))

        overall_data.append((building.name, building_cat_totals))

    # ── Overall Total Summary section ─────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=BLACK, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("OVERALL TOTAL SUMMARY", S["overall_heading"]))

    # Helper: turn {category: count} dict into "Cat - N, Cat - N" string
    def _cat_str(cat_dict: dict) -> str:
        parts = [f"{cat} - {cnt:g}" for cat, cnt in sorted(cat_dict.items())]
        return ", ".join(parts) if parts else "-"

    # Cell paragraph styles for the summary table
    _hdr_style  = ParagraphStyle("ov_hdr",  fontName="Helvetica-Bold", fontSize=9,
                                  alignment=TA_LEFT, textColor=BLACK)
    _name_style = ParagraphStyle("ov_name", fontName="Helvetica-Bold", fontSize=9,
                                  alignment=TA_LEFT, textColor=BLACK)
    _cat_style  = ParagraphStyle("ov_cat",  fontName="Helvetica",      fontSize=9,
                                  alignment=TA_LEFT, textColor=BLACK, leading=13)

    col_name = usable * 0.30
    col_cats = usable * 0.70

    # ── Build summary rows ── header + one row per building ──────────────────
    summary_data = [
        [Paragraph("Building Name", _hdr_style),
         Paragraph("Categories",    _hdr_style)],
    ]

    # Aggregate grand-total categories across all buildings
    grand_cat_totals: dict[str, float] = {}

    for bname, bcat_dict in overall_data:
        for cat, cnt in bcat_dict.items():
            grand_cat_totals[cat] = grand_cat_totals.get(cat, 0) + cnt
        summary_data.append([
            Paragraph(bname, _name_style),
            Paragraph(_cat_str(bcat_dict), _cat_style),
        ])

    # ── Total List row ────────────────────────────────────────────────────────
    summary_data.append([
        Paragraph("Total List", _name_style),
        Paragraph(_cat_str(grand_cat_totals), _cat_style),
    ])

    summary_tbl = Table(summary_data, colWidths=[col_name, col_cats])
    summary_tbl.setStyle(TableStyle([
        # outer border
        ("BOX",           (0, 0), (-1, -1), 0.8, BLACK),
        # all inner grid lines
        ("INNERGRID",     (0, 0), (-1, -1), 0.4, BLACK),
        # header row — bold underline
        ("LINEBELOW",     (0, 0), (-1, 0),  0.8, BLACK),
        # "Total List" last row — thicker top line to separate it
        ("LINEABOVE",     (0, -1), (-1, -1), 0.8, BLACK),
        # padding
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 6),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(summary_tbl)

    doc.build(story)
    buffer.seek(0)
    return buffer


# ── Django view ───────────────────────────────────────────────────────────────
class WorkforceReportView(APIView):
    """
    GET /api/workforce-report/
        ?from_date=YYYY-MM-DD
        &to_date=YYYY-MM-DD
        &buildings=1,2,3
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from_date_str = request.query_params.get("from_date", "").strip()
        to_date_str   = request.query_params.get("to_date",   "").strip()
        buildings_str = request.query_params.get("buildings", "").strip()

        if not from_date_str or not to_date_str:
            return Response(
                {"detail": "from_date and to_date are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not buildings_str:
            return Response(
                {"detail": "At least one building must be selected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            from_date = date.fromisoformat(from_date_str)
            to_date   = date.fromisoformat(to_date_str)
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if from_date > to_date:
            return Response(
                {"detail": "from_date must be before to_date."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            building_ids = [int(b) for b in buildings_str.split(",") if b.strip()]
        except ValueError:
            return Response(
                {"detail": "Invalid building IDs."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pdf_buffer = generate_workforce_pdf(from_date, to_date, building_ids)

        filename = (
            f"Workforce_Report_{_fmt_file(from_date)}_to_{_fmt_file(to_date)}.pdf"
        )

        return FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename=filename,
            content_type="application/pdf",
        )
