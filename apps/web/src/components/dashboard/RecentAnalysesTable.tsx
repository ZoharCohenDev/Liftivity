import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../common/StatusBadge";
import ScoreBadge from "../common/ScoreBadge";
import SectionHeader from "../common/SectionHeader";

export default function RecentAnalysesTable() {
  const theme = useTheme();
  const { sites } = useApp();
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <SectionHeader
          title="Recent Analyses"
          subtitle="Manage and view details of your latest website crawls"
          action={
            <Box display="flex" gap={1}>
              <Button size="small" variant="outlined" startIcon={<FilterListIcon />} sx={{ fontSize: 12 }}>
                Filter
              </Button>
              <Button size="small" variant="outlined" startIcon={<FileDownloadOutlinedIcon />} sx={{ fontSize: 12 }}>
                Export
              </Button>
            </Box>
          }
        />
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Website URL", "Score", "Issues", "Status", "Last Crawl", "Action"].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "text.secondary",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 1,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) => (
              <TableRow
                key={site.id}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  cursor: "pointer",
                  "& td": { borderBottom: `1px solid ${theme.palette.divider}` },
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LanguageIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="body2" fontWeight={500}>
                      {site.url}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <ScoreBadge score={site.score} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {site.issues} detected
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={site.status} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {site.lastCrawl}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ fontSize: 11, p: 0, minWidth: 0, color: "primary.main" }}
                    onClick={() => navigate("/app/report")}
                  >
                    View Report →
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={1.5}>
          <Typography variant="caption" color="text.secondary">
            12 of 20 sites analyzed
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
