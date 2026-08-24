interface ErrorOptions {
  cause?: unknown;
  message?: string;
  action?: string;
}

abstract class BaseError extends Error {
  action: string;
  statusCode: number;

  constructor(
    message: string,
    action: string,
    statusCode: number,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.action = action;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends BaseError {
  constructor({ cause, message, action }: ErrorOptions = {}) {
    super(
      message || 'Um erro de validação ocorreu.',
      action || 'Ajuste os dados enviados e tente novamente.',
      400,
      cause,
    );
  }
}

export class UnauthorizedError extends BaseError {
  constructor({ cause, message, action }: ErrorOptions = {}) {
    super(
      message || 'Falha no login.',
      action || 'Ajuste os dados enviados e tente novamente.',
      401,
      cause,
    );
  }
}

export class ForbiddenError extends BaseError {
  constructor({ cause, message, action }: ErrorOptions = {}) {
    super(
      message || 'Acesso negado.',
      action || 'Verifique suas permissões.',
      403,
      cause,
    );
  }
}

export class NotFoundError extends BaseError {
  constructor({ cause, message, action }: ErrorOptions = {}) {
    super(
      message || 'Não foi possível encontrar este recurso no sistema.',
      action || 'Verifique se os parâmetros enviados na consulta estão certos.',
      404,
      cause,
    );
  }
}

export class ServiceError extends BaseError {
  constructor({ cause, message }: ErrorOptions = {}) {
    super(
      message || 'Serviço indisponível no momento.',
      'Verifique se o serviço está disponível.',
      503,
      cause,
    );
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor() {
    super(
      'Método não permitido para este endpoint.',
      'Verifique se o método HTTP enviado é válido para este endpoint.',
      405,
    );
  }
}

export class InternalServerError extends BaseError {
  constructor({
    cause,
    statusCode,
  }: { cause?: unknown; statusCode?: number } = {}) {
    super(
      'Um erro interno não esperado aconteceu.',
      'Entre em contato com o suporte.',
      statusCode || 500,
      cause,
    );
  }
}
