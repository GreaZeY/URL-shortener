import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const expression =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const regex = new RegExp(expression);

const URLShortener = () => {
  const [targetUrl, setTargetUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const isValidUrl = targetUrl === "" ? true : targetUrl.match(regex);

  const getUrl = async () => {
    try {
      const { data } = await axios.post("/api/url", {
        targetUrl,
        totalVisits: 0,
      });
      setShortenedUrl(`${window.location.origin}/a/${data.id}`);
    } catch (e) {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div
      style={{
        // background:'black',
        width: "100%",
        marginTop: 100,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
      }}
    >
      <Typography mb={20} variant="h4">
        URL Shortener
      </Typography>
      <Box
        width="80%"
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Input
          error={!isValidUrl}
          style={{
            width: "100%",
          }}
          inputProps={{ style: { textAlign: "center" } }}
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />
        {!isValidUrl && (
          <Typography
            width="100%"
            variant="caption"
            textAlign="center"
            color="red"
          >
            Invalid URL
          </Typography>
        )}
      </Box>
      <Button
        disabled={!targetUrl || !isValidUrl}
        style={{ width: 100 }}
        color="primary"
        variant="contained"
        onClick={getUrl}
      >
        Generate
      </Button>
      {shortenedUrl && (
        <Box
          width="80%"
          display="flex"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography textAlign="center" variant="caption">
            Your Shortened URL
          </Typography>
          <TextField
            onClick={handleCopy}
            inputProps={{
              readOnly: true,
              style: { textAlign: "center", padding: 1 },
            }}
            value={shortenedUrl}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <ContentCopyIcon style={{ width: 15, cursor: "pointer" }} />
              ),
            }}
          />
        </Box>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={copied}
        onClose={() => setCopied(false)}
        message="Copied to Clipboard!"
      />
    </div>
  );
};

export default URLShortener;
