import { useMemo, useState } from "react";
import { chatFlow } from "./data/chatFlow";
import { getSourceFromUrl, submitLead } from "./lib/leadService";

const FOUNDER_CONTACT = {
  linkedin: "https://www.linkedin.com/in/shlok-parikh/",
  instagram: "https://www.instagram.com/parikh_shlok_39?igsh=MWpqdndreXRmYWNmNw==",
  email: "shlokparikh1139@gmail.com"
};

const INITIAL_FORM = {
  full_name: "",
  email: "",
  social_handle: "",
  preferred_contact_channel: "",
  role: "",
  organization_name: "",
  audience_source: "",
  problem_frequency: "",
  trust_decision_method: "",
  top_value_interest: "",
  biggest_problem_text: "",
  extra_feedback_text: "",
  interest_level: "",
  wants_beta_access: false,
  wants_demo: false,
  wants_follow_up: false,
  consent_to_store: false
};

function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM,
    audience_source: getSourceFromUrl()
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({
    status: "idle",
    message: ""
  });

  const step = chatFlow[stepIndex];
  const totalSteps = chatFlow.length;
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / totalSteps) * 100),
    [stepIndex, totalSteps]
  );

  const followUpMessage = useMemo(() => {
    if (formData.interest_level === "demo_request") {
      return "Thanks for your interest. I am sharing demos personally right now, so please DM me directly using the details below. If you already shared your contact details here, that helps me follow up faster too.";
    }

    if (formData.interest_level === "beta_access") {
      return "Thanks for joining the early interest list. If you want faster access, you can also DM me directly using the details below.";
    }

    if (formData.interest_level === "feedback_later") {
      return "Thanks for staying connected. If you want to share thoughts later, you can DM me directly using the details below.";
    }

    return "Thanks for taking the time to go through this. If you want to reconnect later, you can reach me directly using the details below.";
  }, [formData.interest_level]);

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
    if (submitState.status !== "idle") {
      setSubmitState({ status: "idle", message: "" });
    }
  };

  const canContinue = useMemo(() => {
    if (!step) {
      return false;
    }

    if (step.type === "message") {
      return true;
    }

    if (step.type === "choice") {
      return Boolean(formData[step.field]);
    }

    if (step.type === "text") {
      if (!step.required) {
        return true;
      }
      return Boolean(formData[step.field]?.trim());
    }

    if (step.type === "contact") {
      if (!formData.full_name.trim()) {
        return false;
      }

      if ((formData.wants_beta_access || formData.wants_demo) && !formData.email.trim()) {
        return false;
      }

      return true;
    }

    if (step.type === "consent") {
      return formData.consent_to_store;
    }

    return true;
  }, [formData, step]);

  const handleChoice = (field, option) => {
    if (field === "interest_level") {
      updateField("interest_level", option.value);
      updateField("wants_beta_access", option.flags?.wants_beta_access ?? false);
      updateField("wants_demo", option.flags?.wants_demo ?? false);
      updateField("wants_follow_up", option.flags?.wants_follow_up ?? false);
      return;
    }

    updateField(field, option.value);
  };

  const nextStep = async () => {
    if (stepIndex === totalSteps - 1) {
      setIsSubmitting(true);
      setSubmitState({ status: "idle", message: "" });

      const result = await submitLead(formData);

      setIsSubmitting(false);
      setSubmitState(result);
      return;
    }

    setStepIndex((current) => current + 1);
  };

  const previousStep = () => {
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const restartFlow = () => {
    setFormData({
      ...INITIAL_FORM,
      audience_source: getSourceFromUrl()
    });
    setStepIndex(0);
    setSubmitState({ status: "idle", message: "" });
  };

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="app-frame">
        <section className="hero-panel">
          <p className="eyebrow">PassionStack outreach assistant</p>
          <h1>Explain the idea, collect signal, and protect the deeper product logic.</h1>
          <p className="hero-copy">
            This guided chatbot helps new people understand the ebook verification angle,
            share feedback, and request beta access without you exposing everything at once.
          </p>

          <div className="hero-points">
            <span>Trust-focused pitch</span>
            <span>Channel-based lead tracking</span>
            <span>Supabase-ready form capture</span>
          </div>
        </section>

        <section className="chat-panel">
          <div className="chat-header">
            <div>
              <p className="chat-title">Founder intro flow</p>
              <p className="chat-subtitle">
                Share this link on LinkedIn, Instagram, or WhatsApp.
              </p>
            </div>
            <span className="progress-label">{progress}%</span>
          </div>

          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="conversation">
            <div className="message message-bot">
              <p className="message-label">PassionStack</p>
              <p>{step.prompt}</p>
            </div>

            {step.type === "choice" && (
              <div className="option-grid">
                {step.options.map((option) => {
                  const isActive = formData[step.field] === option.value;
                  return (
                    <button
                      key={option.value}
                      className={`option-card ${isActive ? "option-card-active" : ""}`}
                      type="button"
                      onClick={() => handleChoice(step.field, option)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {step.type === "text" && (
              <label className="input-block">
                <span>{step.label}</span>
                <textarea
                  rows={5}
                  maxLength={step.maxLength ?? 500}
                  placeholder={step.placeholder}
                  value={formData[step.field]}
                  onChange={(event) => updateField(step.field, event.target.value)}
                />
              </label>
            )}

            {step.type === "contact" && (
              <div className="contact-grid">
                <label className="input-block">
                  <span>Your name</span>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="Enter your name"
                    value={formData.full_name}
                    onChange={(event) => updateField("full_name", event.target.value)}
                  />
                </label>

                <label className="input-block">
                  <span>Email {formData.wants_beta_access || formData.wants_demo ? "(required)" : "(optional)"}</span>
                  <input
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={120}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </label>

                <label className="input-block">
                  <span>LinkedIn or Instagram handle</span>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="@yourhandle or profile link"
                    value={formData.social_handle}
                    onChange={(event) => updateField("social_handle", event.target.value)}
                  />
                </label>

                <label className="input-block">
                  <span>Preferred contact channel</span>
                  <select
                    value={formData.preferred_contact_channel}
                    onChange={(event) =>
                      updateField("preferred_contact_channel", event.target.value)
                    }
                  >
                    <option value="">Choose one</option>
                    <option value="email">Email</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </label>

                <label className="input-block">
                  <span>Organization or college</span>
                  <input
                    type="text"
                    maxLength={120}
                    placeholder="Optional"
                    value={formData.organization_name}
                    onChange={(event) => updateField("organization_name", event.target.value)}
                  />
                </label>
              </div>
            )}

            {step.type === "consent" && (
              <label className="consent-card">
                <input
                  type="checkbox"
                  checked={formData.consent_to_store}
                  onChange={(event) => updateField("consent_to_store", event.target.checked)}
                />
                <span>
                  I agree that PassionStack can save my response and contact me about the
                  early beta or demo.
                </span>
              </label>
            )}

            {submitState.status === "success" && (
              <div className="message message-success">
                <p className="message-label">Saved</p>
                <p>{submitState.message}</p>
                <div className="contact-card">
                  <p>{followUpMessage}</p>
                  <p>
                    LinkedIn:{" "}
                    <a href={FOUNDER_CONTACT.linkedin} target="_blank" rel="noreferrer">
                      {FOUNDER_CONTACT.linkedin}
                    </a>
                  </p>
                  <p>
                    Instagram:{" "}
                    <a href={FOUNDER_CONTACT.instagram} target="_blank" rel="noreferrer">
                      {FOUNDER_CONTACT.instagram}
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a href={`mailto:${FOUNDER_CONTACT.email}`}>{FOUNDER_CONTACT.email}</a>
                  </p>
                </div>
              </div>
            )}

            {submitState.status === "error" && (
              <div className="message message-error">
                <p className="message-label">Submission issue</p>
                <p>{submitState.message}</p>
              </div>
            )}
          </div>

          <div className="action-row">
            <button
              type="button"
              className="ghost-button"
              onClick={previousStep}
              disabled={stepIndex === 0 || isSubmitting}
            >
              Back
            </button>

            {submitState.status === "success" ? (
              <button type="button" className="primary-button" onClick={restartFlow}>
                Start again
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={nextStep}
                disabled={!canContinue || isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : stepIndex === totalSteps - 1
                    ? "Submit"
                    : "Continue"}
              </button>
            )}
          </div>

          <p className="footer-note">
            Current source: <strong>{formData.audience_source || "direct"}</strong>
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
