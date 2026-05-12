import { hasSupabaseConfig, supabase } from "./supabase";

export function getSourceFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("source") || "direct";
}

export async function submitLead(formData) {
  const payload = {
    ...formData,
    audience_source: formData.audience_source || "direct",
    completion_status: "completed",
    completed_at: new Date().toISOString()
  };

  if (!hasSupabaseConfig || !supabase) {
    console.log("Mock lead payload", payload);
    return {
      status: "success",
      message:
        "The chatbot flow is working in local mock mode. Once you add the Supabase URL and anon key, submissions will save to your database."
    };
  }

  try {
    const { error } = await supabase.from("outreach_chat_leads").insert(payload);

    if (error) {
      return {
        status: "error",
        message: error.message
      };
    }

    return {
      status: "success",
      message: "Your response has been saved. I can now follow up with the beta or demo."
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message || "Something went wrong while saving your response."
    };
  }
}
