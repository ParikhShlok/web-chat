export const chatFlow = [
  {
    id: "welcome",
    type: "message",
    prompt:
      "Hi, I am building PassionStack. This short chat explains the ebook verification angle, gathers your feedback, and helps me understand whether this problem matters to you."
  },
  {
    id: "role",
    type: "choice",
    field: "role",
    prompt: "Which best describes you?",
    options: [
      { label: "Student", value: "student" },
      { label: "Founder", value: "founder" },
      { label: "Creator", value: "creator" },
      { label: "Mentor", value: "mentor" },
      { label: "Community lead", value: "community_lead" },
      { label: "Just exploring", value: "curious_visitor" }
    ]
  },
  {
    id: "problem_frequency",
    type: "choice",
    field: "problem_frequency",
    prompt:
      "Have you seen students buy or use learning content that did not match its promise, quality, or usefulness?",
    options: [
      { label: "Yes, often", value: "often" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Rarely", value: "rarely" },
      { label: "Not sure", value: "not_sure" }
    ]
  },
  {
    id: "trust_decision_method",
    type: "choice",
    field: "trust_decision_method",
    prompt: "How do you usually decide whether an ebook or study resource is trustworthy?",
    options: [
      { label: "Friend recommendations", value: "friend_recommendations" },
      { label: "Social media reviews", value: "social_media_reviews" },
      { label: "Trial and error", value: "trial_and_error" },
      { label: "Price or brand name", value: "price_or_brand" },
      { label: "I usually cannot tell", value: "cannot_tell" }
    ]
  },
  {
    id: "product_message",
    type: "message",
    prompt:
      "PassionStack is starting with a simple goal: help users make better decisions about ebooks and learning resources through a trust-focused verification layer. The aim is to reduce wasted money, confusion, and low-quality learning choices."
  },
  {
    id: "top_value_interest",
    type: "choice",
    field: "top_value_interest",
    prompt: "What would matter most in a product like this?",
    options: [
      { label: "Trust before buying", value: "trust_before_buying" },
      { label: "Clearer quality signals", value: "clearer_quality_signals" },
      { label: "Better student recommendations", value: "student_recommendations" },
      { label: "Time saving", value: "time_saving" },
      { label: "Lower risk of wasting money", value: "lower_risk" }
    ]
  },
  {
    id: "biggest_problem_text",
    type: "text",
    field: "biggest_problem_text",
    label: "Your answer",
    required: true,
    maxLength: 500,
    prompt: "What is the biggest problem you see with ebooks or online learning resources today?",
    placeholder: "Share the main issue you have noticed."
  },
  {
    id: "extra_feedback_text",
    type: "text",
    field: "extra_feedback_text",
    label: "Optional extra thoughts",
    required: false,
    maxLength: 500,
    prompt: "Anything else you want to tell me before I share beta access or a demo?",
    placeholder: "Optional feedback or ideas."
  },
  {
    id: "interest_level",
    type: "choice",
    field: "interest_level",
    prompt: "Would you like to stay connected with PassionStack?",
    options: [
      {
        label: "Yes, send me beta access",
        value: "beta_access",
        flags: {
          wants_beta_access: true,
          wants_demo: false,
          wants_follow_up: true
        }
      },
      {
        label: "Yes, show me a demo",
        value: "demo_request",
        flags: {
          wants_beta_access: false,
          wants_demo: true,
          wants_follow_up: true
        }
      },
      {
        label: "Yes, I can give feedback later",
        value: "feedback_later",
        flags: {
          wants_beta_access: false,
          wants_demo: false,
          wants_follow_up: true
        }
      },
      {
        label: "Not right now",
        value: "not_now",
        flags: {
          wants_beta_access: false,
          wants_demo: false,
          wants_follow_up: false
        }
      }
    ]
  },
  {
    id: "contact",
    type: "contact",
    prompt: "Where can I reach you if I share the beta or demo?"
  },
  {
    id: "consent",
    type: "consent",
    prompt: "Last step: can I save your response to improve PassionStack and contact you about this early beta?"
  }
];
