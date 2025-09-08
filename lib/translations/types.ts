export interface Translation {
  navigation: {
    features: string
    betaBenefits: string
    aboutUs: string
    faq: string
    home: string
    back: string
    backToHome: string
    dashboard: string
    admin: string
    users: string
    settings: string
    profile: string
    loading: string
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    update: string
    search: string
    filter: string
    export: string
    import: string
    refresh: string
    copy: string
    duplicate: string
    manager: string
    editor: string
  }
  hero: {
    announcement: string
    title: string
    subtitle: string
    joinBeta: string
    learnMore: string
  }
  about: {
    badge: string
    title: string
    mainText: string
    secondaryText: string
    stats: {
      creators: string
      brands: string
    }
    values: {
      innovation: {
        title: string
        description: string
      }
      community: {
        title: string
        description: string
      }
      quality: {
        title: string
        description: string
      }
    }
    mission: {
      title: string
      description: string
    }
  }
  features: {
    badge: string
    title: string
    subtitle: string
    tabs: {
      brands: string
      creators: string
    }
    brandSteps: {
      registration: {
        title: string
        description: string
      }
      setup: {
        title: string
        description: string
      }
      search: {
        title: string
        description: string
      }
      collaboration: {
        title: string
        description: string
      }
      results: {
        title: string
        description: string
      }
    }
    creatorSteps: {
      join: {
        title: string
        description: string
      }
      choose: {
        title: string
        description: string
      }
      promote: {
        title: string
        description: string
      }
      earn: {
        title: string
        description: string
      }
      grow: {
        title: string
        description: string
      }
    }
  }
  betaBenefits: {
    badge: string
    title: string
    subtitle: string
    forCreators: {
      title: string
      subtitle: string
    }
    forBrands: {
      title: string
      subtitle: string
    }
    benefits: {
      priorityAccess: {
        title: string
        description: string
      }
      reducedFees: {
        title: string
        description: string
      }
      personalSupport: {
        title: string
        description: string
      }
      exclusiveFeatures: {
        title: string
        description: string
      }
      closedCommunity: {
        title: string
        description: string
      }
    }
    cta: {
      title: string
      description: string
      button: string
    }
  }
  faq: {
    title: string
    questions: {
      free: {
        question: string
        answer: string
      }
      earn: {
        question: string
        answer: string
      }
      tracking: {
        question: string
        answer: string
      }
      beta: {
        question: string
        answer: string
      }
    }
  }
  footer: {
    description: string
    quickLinks: {
      title: string
      home: string
      features: string
      betaBenefits: string
      contact: string
    }
    legal: {
      title: string
      privacy: string
      terms: string
    }
    copyright: string
  }
  legal: {
    privacy: {
      title: string
      intro: {
        company: string
        primary: string
        secondary: string
        tertiary: string
      }
      backHome: string
      lastUpdated: string
      sections: {
        definitions: {
          title: string
          content: string[]
        }
        audienceInfo: {
          title: string
          intro: string
          infoWeCollect: {
            title: string
            items: string[]
          }
          howWeUse: {
            title: string
            items: string[]
          }
        }
        creatorInfo: {
          title: string
          intro: string
          infoCreatorsShare: {
            title: string
            items: string[]
          }
          sensitiveInfo: {
            title: string
            content: string
          }
        }
        brandPartnerData: {
          title: string
          intro: string
          whatBrandsReceive: {
            title: string
            items: string[]
          }
          whatBrandsDontReceive: {
            title: string
            items: string[]
          }
        }
        howWeShare: {
          title: string
          intro: string
          serviceProviders: {
            title: string
            content: string
          }
          legalRequirements: {
            title: string
            content: string
          }
        }
        cookies: {
          title: string
          content: string
        }
        dataSecurity: {
          title: string
          content: string
        }
        globalPrivacy: {
          title: string
          content: string
        }
        privacyChoices: {
          title: string
          content: string
        }
        contactUs: {
          title: string
          content: string
          company: string
          email: string
          address: string
          note: string
        }
        changes: {
          title: string
          content: string
        }
      }
      tableOfContents: {
        title: string
        items: {
          definitions: string
          audienceInfo: string
          creatorInfo: string
          brandPartnerData: string
          howWeShare: string
          cookies: string
          dataSecurity: string
          globalPrivacy: string
          privacyChoices: string
          contactUs: string
          changes: string
        }
      }
    }
    terms: {
      title: string
      intro: {
        company: string
        primary: string
        secondary: string
        tertiary: string
      }
      backHome: string
      lastUpdated: string
      sections: {
        introduction: {
          title: string
          contract: {
            title: string
            content: string[]
          }
          ourServices: {
            title: string
            content: string[]
          }
        }
        serviceAvailability: {
          title: string
          content: string[]
        }
        accessToServices: {
          title: string
          intro: string
          betaServices: {
            title: string
            content: string[]
          }
          eligibility: {
            title: string
            content: string
            items: string[]
          }
          registration: {
            title: string
            content: string[]
          }
        }
        userConduct: {
          title: string
          intro: string
          items: string[]
        }
        contentAndIP: {
          title: string
          userContent: {
            title: string
            content: string
          }
          platformContent: {
            title: string
            content: string
          }
        }
        paymentsAndFees: {
          title: string
          serviceFees: {
            title: string
            content: string
            items: string[]
          }
          paymentTerms: {
            title: string
            items: string[]
          }
        }
        disclaimers: {
          title: string
          platformRole: {
            title: string
            intro: string
            items: string[]
          }
          serviceAvailability: {
            title: string
            content: string
          }
        }
        assignment: {
          title: string
          content: string[]
        }
        noWarranties: {
          title: string
          content: string[]
        }
        limitationLiability: {
          title: string
          content: string[]
        }
        indemnification: {
          title: string
          intro: string
          items: string[]
          additional: string
        }
        arbitration: {
          title: string
          notice: string
          agreement: {
            title: string
            content: string[]
          }
        }
        generalTerms: {
          title: string
          forceMajeure: {
            title: string
            content: string
          }
          waiver: {
            title: string
            content: string[]
          }
        }
        contactUs: {
          title: string
          content: string
          company: string
          email: string
          address: string
          note: string
        }
      }
      tableOfContents: {
        title: string
        items: {
          introduction: string
          serviceAvailability: string
          accessToServices: string
          userConduct: string
          contentAndIP: string
          paymentsAndFees: string
          disclaimers: string
          assignment: string
          noWarranties: string
          limitationLiability: string
          indemnification: string
          arbitration: string
          generalTerms: string
          contactUs: string
        }
      }
    }
  }
  auth: {
    signIn: {
      title: string
      emailLabel: string
      passwordLabel: string
      rememberMe: string
      forgotPassword: string
      signInButton: string
      noAccount: string
      signUpLink: string
      orContinueWith: string
      googleButton: string
    }
    signUp: {
      title: string
      fullNameLabel: string
      emailLabel: string
      passwordLabel: string
      confirmPasswordLabel: string
      agreeToTerms: string
      termsLink: string
      privacyLink: string
      signUpButton: string
      alreadyHaveAccount: string
      signInLink: string
      orContinueWith: string
      googleButton: string
    }
    errors: {
      invalidEmail: string
      weakPassword: string
      passwordMismatch: string
      emailAlreadyInUse: string
      invalidCredentials: string
      userNotFound: string
      tooManyRequests: string
      networkError: string
      generic: string
    }
    success: {
      signUpComplete: string
      signInSuccess: string
      passwordResetSent: string
      signOutSuccess: string
    }
    forgotPassword: {
      title: string
      description: string
      emailLabel: string
      sendResetButton: string
      backToSignIn: string
    }
    profile: {
      title: string
      language: string
      changeLanguage: string
    }
  }
}