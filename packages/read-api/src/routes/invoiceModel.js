// invoiceModel.js
var mongoose = require('mongoose');
// Setup schema
var invoiceSchema = mongoose.Schema(
{
  invoice_id: {
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  shop: {
    type: Object,
    properties: {
      shop_id: {
        type: Number,
        required: true
      },
      shop_group: {
        type: String
      },
      shop_name: {
        type: String
      },
      shop_info: {
        type: String
      }
    },
    required: true
  },
  order: {
    type: Array,
    items: {
      type: Object,
      properties: {
        product_id: {
          type: Number
        },
        product_qty: {
          type: Object,
          properties: {
            quantity: {
              type: Number
            },
            unitCode: {
              type: String
            }
          },
          required: true
        },
        product_desc: {
          type: String
        },
        product_short_desc: {
          type: String
        },
        product_taxes: {
          type: Array,
          items: {
            type: Object,
            properties: {
              code: {
                type: String
              },
              value: {
                type: Number
              },
              amount: {
                type: Object,
                properties: {
                  scale: {
                    type: Number
                  },
                  amount: {
                    type: Number
                  },
                  currency: {
                    type: Object,
                    properties: {
                      code: {
                        type: String,
                        default: "EUR"
                      },
                      symbol: {
                        type: String,
                        default: "€"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        product_prices: {
          type: Object,
          properties: {
            unit_price_with_taxes: {
              type: Object,
              properties: {
                scale: {
                  type: Number
                },
                amount: {
                  type: Number
                },
                currency: {
                  type: Object,
                  properties: {
                    code: {
                      type: String,
                      default: "EUR"
                    },
                    symbol: {
                      type: String,
                      default: "€"
                    }
                  }
                }
              }
            },
            unit_price_without_taxes: {
              type: Object,
              properties: {
                scale: {
                  type: Number
                },
                amount: {
                  type: Number
                },
                currency: {
                  type: Object,
                  properties: {
                    code: {
                      type: String,
                      default: "EUR"
                    },
                    symbol: {
                      type: String,
                      default: "€"
                    }
                  }
                }
              }
            },
            price_with_taxes: {
              type: Object,
              properties: {
                scale: {
                  type: Number
                },
                amount: {
                  type: Number
                },
                currency: {
                  type: Object,
                  properties: {
                    code: {
                      type: String,
                      default: "EUR"
                    },
                    symbol: {
                      type: String,
                      default: "€"
                    }
                  }
                }
              }
            },
            price_without_taxes: {
              type: Object,
              properties: {
                scale: {
                  type: Number
                },
                amount: {
                  type: Number
                },
                currency: {
                  type: Object,
                  properties: {
                    code: {
                      type: String,
                      default: "EUR"
                    },
                    symbol: {
                      type: String,
                      default: "€"
                    }
                  }
                }
              }
            }
          },
          required: true
        }
      }
    }
  },
  invoice_taxes: {
    type: Array,
    items: {
      type: Object,
      properties: {
        code: {
          type: String
        },
        value: {
          type: Number
        },
        amount: {
          type: Object,
          properties: {
            scale: {
              type: Number
            },
            amount: {
              type: Number
            },
            currency: {
              type: Object,
              properties: {
                code: {
                  type: String,
                  default: "EUR"
                },
                symbol: {
                  type: String,
                  default: "€"
                }
              }
            }
          }
        }
      }
    }
  },
  invoice_prices: {
    type: Object,
    properties: {
      price_with_taxes: {
        type: Object,
        properties: {
          scale: {
            type: Number
          },
          amount: {
            type: Number
          },
          currency: {
            type: Object,
            properties: {
              code: {
                type: String,
                default: "EUR"
              },
              symbol: {
                type: String,
                default: "€"
              }
            }
          }
        }
      },
      price_without_taxes: {
        type: Object,
        properties: {
          scale: {
            type: Number
          },
          amount: {
            type: Number
          },
          currency: {
            type: Object,
            properties: {
              code: {
                type: String,
                default: "EUR"
              },
              symbol: {
                type: String,
                default: "€"
              }
            }
          }
        }
      }
    },
    required: true
  },
  customer: {
    type: Object,
    properties: {
      client_id: {
        type: String
      }
    },
    required: true
  },
  certification: {
    current_state: {
      type: Object,
      properties: {
        date: {
          type: String,
          default: Date.now
        },
        code: {
          type: String,
          default: "STAGING"
        }
      }
    },
    states: {
      type: Array,
      items: {
        type: Object,
        properties: {
          date: {
            type: String
          },
          code: {
            type: String
          }
        }
      }
    },
    transaction: {
      type: Object
    }
  }
}
);
// Export Invoice model
var Invoice = module.exports = mongoose.model('invoices', invoiceSchema);
module.exports.get = function (callback, limit) {
    Invoice.find(callback).sort({create_date: -1}).limit(limit);
}
