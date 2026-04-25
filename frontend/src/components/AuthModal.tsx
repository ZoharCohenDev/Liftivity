import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "register";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: Mode;
}

export default function AuthModal({ open, onClose, onSuccess, initialTab = "login" }: Props) {
  const theme = useTheme();
  const { login, register } = useAuth();
  const isDark = theme.palette.mode === "dark";

  const [mode, setMode] = useState<Mode>(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode(initialTab);
      setEmail("");
      setPassword("");
      setDisplayName("");
      setError(null);
    }
  }, [open, initialTab]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, displayName.trim());
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { error?: { message?: string } } }).data?.error?.message ??
        (err as Error).message ??
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Field styles ────────────────────────────────────────────────────────
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      borderRadius: 2,
      fontSize: 14,
      "& fieldset": {
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(91,123,255,0.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#5B7BFF",
        borderWidth: 1,
        boxShadow: "0 0 0 3px rgba(91,123,255,0.15)",
      },
      "& input": { py: 1.4 },
    },
    "& .MuiInputLabel-root": { fontSize: 14 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#5B7BFF" },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          bgcolor: isDark ? "#111827" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 4,
          width: "100%",
          maxWidth: 440,
          mx: 2,
          overflow: "hidden",
        },
      }}
    >
      {/* ── Gradient header banner ────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          px: 3,
          pt: 4,
          pb: 3,
          background: isDark
            ? "linear-gradient(135deg, rgba(91,123,255,0.12) 0%, rgba(167,139,250,0.10) 100%)"
            : "linear-gradient(135deg, rgba(91,123,255,0.08) 0%, rgba(167,139,250,0.06) 100%)",
        }}
      >
        {/* Decorative glow blobs */}
        <Box sx={{ position: "absolute", top: -40, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(91,123,255,0.18)", filter: "blur(50px)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", top: -20, right: -10, width: 100, height: 100, borderRadius: "50%", background: "rgba(167,139,250,0.2)", filter: "blur(35px)", pointerEvents: "none" }} />

        {/* Close button */}
        <IconButton
          size="small"
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "text.secondary",
            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.25} mb={2.5} sx={{ position: "relative" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(91,123,255,0.45)",
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 17, lineHeight: 1 }}>L</Typography>
          </Box>
          <Typography fontWeight={700} fontSize={15} color="text.primary">
            Liftivity
          </Typography>
        </Box>

        {/* Headline */}
        <Box sx={{ position: "relative" }}>
          <Typography variant="h5" fontWeight={800} lineHeight={1.2} mb={0.5}>
            {mode === "login" ? "Welcome back 👋" : "Get started free"}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {mode === "login"
              ? "Sign in to continue to your dashboard"
              : "Create your account and start optimizing"}
          </Typography>
        </Box>
      </Box>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <Box sx={{ px: 3, pt: 3, pb: 3.5 }}>
        {/* Sliding pill toggle */}
        <Box
          sx={{
            position: "relative",
            bgcolor: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.05)",
            borderRadius: "100px",
            p: "4px",
            display: "flex",
            mb: 3,
          }}
        >
          {/* Animated pill */}
          <Box
            sx={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: mode === "login" ? 4 : "calc(50% + 2px)",
              width: "calc(50% - 6px)",
              bgcolor: isDark ? "#1E2D4A" : "#ffffff",
              borderRadius: "100px",
              border: `1px solid ${isDark ? "rgba(91,123,255,0.25)" : "rgba(91,123,255,0.2)"}`,
              boxShadow: isDark
                ? "0 2px 12px rgba(0,0,0,0.4)"
                : "0 2px 8px rgba(0,0,0,0.12)",
              transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {(["login", "register"] as Mode[]).map((m) => (
            <Box
              key={m}
              onClick={() => switchMode(m)}
              sx={{
                flex: 1,
                textAlign: "center",
                py: 0.9,
                cursor: "pointer",
                position: "relative",
                zIndex: 1,
                userSelect: "none",
              }}
            >
              <Typography
                fontSize={13}
                fontWeight={600}
                sx={{
                  color: mode === m ? "primary.main" : "text.secondary",
                  transition: "color 0.2s",
                }}
              >
                {m === "login" ? "Sign In" : "Register"}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              fontSize: 13,
              py: 0.5,
              borderRadius: 2,
              bgcolor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              "& .MuiAlert-icon": { color: "#ef4444" },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          {mode === "register" && (
            <TextField
              label="Display Name"
              placeholder="Your full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
              required
              fullWidth
              autoComplete="name"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />
          )}

          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            fullWidth
            autoComplete="email"
            autoFocus={mode === "login"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />

          <TextField
            label="Password"
            type="password"
            placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            fullWidth
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            inputProps={mode === "register" ? { minLength: 8 } : undefined}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 0.5,
              py: 1.4,
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)",
              boxShadow: "0 4px 20px rgba(91,123,255,0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #4361EE 0%, #9370fa 100%)",
                boxShadow: "0 6px 24px rgba(91,123,255,0.55)",
              },
              "&:disabled": { opacity: 0.6, boxShadow: "none" },
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </Box>

        {/* Bottom switch */}
        <Box display="flex" justifyContent="center" mt={2.5}>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {mode === "login" ? "New to Liftivity? " : "Already have an account? "}
            <Typography
              component="span"
              fontSize={13}
              fontWeight={700}
              sx={{
                color: "primary.main",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create a free account" : "Sign in"}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}
