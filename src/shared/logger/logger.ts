export type LoggerContext = Record<string, unknown>;

function formatMessage(
  level: string,
  scope: string,
  message: string,
  context?: LoggerContext,
) {
  return {
    timestamp: new Date().toISOString(),
    level,
    scope,
    message,
    context,
  };
}

type MessageOrContext = string | LoggerContext;

function normalize(
  messageOrContext?: MessageOrContext,
  context?: LoggerContext,
): { message: string; context?: LoggerContext } {
  if (typeof messageOrContext === "string") {
    return { message: messageOrContext, context };
  }
  return { message: "", context: messageOrContext };
}

export const logger = {
  info(scope: string, messageOrContext?: MessageOrContext, context?: LoggerContext) {
    const { message, context: ctx } = normalize(messageOrContext, context);
    console.log(formatMessage("info", scope, message, ctx));
  },

  warn(scope: string, messageOrContext?: MessageOrContext, context?: LoggerContext) {
    const { message, context: ctx } = normalize(messageOrContext, context);
    console.warn(formatMessage("warn", scope, message, ctx));
  },

  error(scope: string, messageOrContext?: MessageOrContext, context?: LoggerContext) {
    const { message, context: ctx } = normalize(messageOrContext, context);
    console.error(formatMessage("error", scope, message, ctx));
  },

  audit(scope: string, messageOrContext?: MessageOrContext, context?: LoggerContext) {
    const { message, context: ctx } = normalize(messageOrContext, context);
    console.info(formatMessage("audit", scope, message, ctx));
  },

  realtime(scope: string, messageOrContext?: MessageOrContext, context?: LoggerContext) {
    const { message, context: ctx } = normalize(messageOrContext, context);
    console.info(formatMessage("realtime", scope, message, ctx));
  },
};
