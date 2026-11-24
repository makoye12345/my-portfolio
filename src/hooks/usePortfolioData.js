import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Existing public portfolio defaults
const defaultProfile = {
  full_name: "Deus Makoye",
  professional_title: "Full Stack Developer",
  introduction:
    "I am a Full Stack Developer specializing in building modern, " +
    "responsive, and user-friendly web applications. " +
    "I develop frontend interfaces using React, JavaScript, HTML, " +
    "and CSS, and backend systems using PHP and Laravel.",
  image_path: null,
};

const defaultContact = {
  email: "makoyedeus8@gmail.com",
  phone: "+255612470595",
  location: "Dodoma, Tanzania",
  github_url: "https://github.com/makoye12345",
  linkedin_url:
    "https://www.linkedin.com/in/deus-makoye972310288",
  whatsapp_number: "255612470595",
};

// Change this if your existing local CV has a different filename.
const LOCAL_CV = "/cv.pdf.pdf";
const LOCAL_PROFILE_IMAGE = "/images/profile.png";

function usePublicRecord(table, columns, fallback) {
  const [data, setData] = useState(fallback);


  useEffect(() => {
    let active = true;

    async function loadRecord() {
  try {
    const { data: record, error } = await supabase
      .from(table)
      .select(columns)
      .eq("id", 1)
      .maybeSingle();

    if (!active) return;

    if (error) {
      console.error(`Failed to load ${table}:`, error);
      return;
    }

    if (record) {
      setData({ ...fallback, ...record });
    }
  } catch (error) {
    if (active) {
      console.error(`Failed to load ${table}:`, error);
    }
  }
}

    loadRecord();

    return () => {
      active = false;
    };
  }, [table, columns]);

  return data;
}

// =====================================
// PROFILE
// =====================================

export function usePortfolioProfile() {
  return usePublicRecord(
    "portfolio_profile",
    "full_name, professional_title, introduction, image_path",
    defaultProfile
  );
}

// =====================================
// CONTACT
// =====================================

export function usePortfolioContact() {
  return usePublicRecord(
    "portfolio_contact",
    "email, phone, location, github_url, linkedin_url, whatsapp_number",
    defaultContact
  );
}

// =====================================
// CV
// =====================================

export function usePortfolioCV() {
  const cv = usePublicRecord(
    "portfolio_cv",
    "file_path, original_name",
    { file_path: null, original_name: null }
  );

  if (!cv.file_path) {
    return {
      url: LOCAL_CV,
      download: true,
    };
  }

  const { data } = supabase.storage
    .from("portfolio-cv")
    .getPublicUrl(cv.file_path);

  return {
    url: data.publicUrl,
    download: false,
  };
}

// =====================================
// PROFILE PICTURE
// =====================================

export function getProfileImageUrl(imagePath) {
  if (!imagePath) {
    return LOCAL_PROFILE_IMAGE;
  }

  const { data } = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

export function usePortfolioProfileWithLoading() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("portfolio_profile")
          .select(
            "full_name, professional_title, introduction, image_path"
          )
          .eq("id", 1)
          .maybeSingle();

        if (error) throw error;

        if (active) {
          setProfile({
            ...defaultProfile,
            ...(data || {}),
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);

        if (active) {
          setProfile({ ...defaultProfile });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return { profile, loading };
}