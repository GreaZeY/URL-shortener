import { LinearProgress } from "@mui/material";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const RedirectShortenURL = () => {
  const params = useParams<{ urlId: string }>();
  const { urlId } = params || {};
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { ip },
        } = await axios.get("https://api.ipify.org/?format=json");
        const { data } = await axios.patch(`/api/url`, { id: urlId, ip });
        const { targetUrl } = data.url;
        window.location.href = targetUrl;
      } catch (e) {}
    })();
  }, [urlId]);

  return <LinearProgress />;
};

export default RedirectShortenURL;
