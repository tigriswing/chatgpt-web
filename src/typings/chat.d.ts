declare namespace Chat {

	interface Chat {
		dateTime: string
		text: string
		inversion?: boolean
		error?: boolean
		loading?: boolean
		conversationOptions?: ConversationRequest | null
		requestOptions: { prompt: string; options?: ConversationRequest | null }
	}

	interface History {
		title: string
		isEdit: boolean
		uuid: number
	}

	interface ChatState {
		active: number | null
		usingContext: boolean;
		history: History[]
		chat: { uuid: number; data: Chat[] }[]
	}

	interface ConversationRequest {
		conversationId?: string
		parentMessageId?: string
	}

	interface ConversationResponse {
		conversationId: string
		detail: {
			choices: { finish_reason: string; index: number; logprobs: any; text: string }[]
			created: number
			id: string
			model: string
			object: string
			usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number }
		}
		id: string
		parentMessageId: string
		role: string
		text: string
	}

	interface ChatMessage {
		role : string
		content : string
	}

	interface ChatAskBean {
		systemArray : ChatMessage[] 
		assArray? : ChatMessage[] | null
		userQuery? : string | null
		modelType?:string|null
	}

	interface ChatFlowRequest {
		reqId : string
		currentLen : string
	}

	interface SendSms {
		mobile : string
		requestId : string
		actionType : string
	}

	interface VerifySms {
		mobile : string
		requestId : string
		smsCode : string
		password : string
		actionType : string
	}

	interface MobileLogin {
		mobile : string
		password : string
	}
}
