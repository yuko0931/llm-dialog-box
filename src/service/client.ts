import { CozeAPI } from '@coze/api'

import config from './config.ts'

const key = 'zh'

const apiKey = config[key].auth.pat.COZE_API_KEY
const botId = config[key].COZE_BOT_ID
const spaceId = config[key].COZE_SPACE_ID
const workflowId = config[key].COZE_WORKFLOW_ID
const baseURL = config[key].COZE_BASE_URL
const datasetId = config[key].DATASET_ID

const client = new CozeAPI({
  baseURL,
  token: apiKey,
  allowPersonalAccessTokenInBrowser: true, // Allow the browers to use PAT
})

async function sleep(ms: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

export { client, botId, spaceId, workflowId, sleep, baseURL, apiKey, datasetId }
