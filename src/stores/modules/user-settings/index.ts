import { Module } from 'vuex'
import {
  CompressEncoderEnum,
  ElementPlusSizeEnum,
  ImageLinkRuleModel,
  ImageLinkTypeEnum,
  LanguageEnum,
  ThemeModeEnum,
  UserSettingsModel,
  WatermarkPositionEnum
} from '@/common/model'
import { deepAssignObject, getLocal, getSession, getUuid, setLocal, setSession } from '@/utils'
import RootStateTypes from '@/stores/types'
import UserSettingsStateTypes, {
  GlobalSettingsModel,
  ImgLinkRuleActionsEnum
} from '@/stores/modules/user-settings/types'
import { LS_SETTINGS, SS_GLOBAL_SETTINGS } from '@/common/constant'
import { imgLinkRuleVerification } from '@/stores/modules/user-settings/utils'
import i18n from '@/plugins/vue/i18n'

const initSettings: UserSettingsModel = {
  imageName: {
    enableHash: true,
    addPrefix: { enable: false, prefix: '' }
  },
  compress: {
    enable: true,
    encoder: CompressEncoderEnum.webP
  },
  imageLinkType: {
    selected: ImageLinkTypeEnum.GitHub,
    presetList: {
      // GitHubPages
      [`${ImageLinkTypeEnum.GitHubPages}`]: {
        id: getUuid(),
        name: ImageLinkTypeEnum.GitHubPages,
        rule: 'https://{{owner}}.github.io/{{repo}}/{{path}}'
      },
      // GitHub
      [`${ImageLinkTypeEnum.GitHub}`]: {
        id: getUuid(),
        name: ImageLinkTypeEnum.GitHub,
        rule: 'https://github.com/{{owner}}/{{repo}}/raw/{{branch}}/{{path}}'
      },
      // jsDelivr
      [`${ImageLinkTypeEnum.jsDelivr}`]: {
        id: getUuid(),
        name: ImageLinkTypeEnum.jsDelivr,
        rule: 'https://cdn.jsdelivr.net/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}'
      },
      // Statically
      [`${ImageLinkTypeEnum.Statically}`]: {
        id: getUuid(),
        name: ImageLinkTypeEnum.Statically,
        rule: 'https://cdn.statically.io/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}'
      },
      // ChinaJsDelivr
      [`${ImageLinkTypeEnum.ChinaJsDelivr}`]: {
        id: getUuid(),
        name: ImageLinkTypeEnum.ChinaJsDelivr,
        rule: 'https://jsd.cdn.zzko.cn/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}'
      }
    }
  },
  imageLinkFormat: {
    enable: false,
    selected: 'Markdown',
    presetList: [
      {
        name: 'Markdown',
        format: '![imageName](imageLink)'
      },
      {
        name: 'HTML',
        format: '<img src="imageLink" alt="imageName" />'
      },
      {
        name: 'BBCode',
        format: '[img]imageLink[/img]'
      }
    ]
  },
  starred: false,
  watermark: {
    enable: false,
    text: 'YY💓PP',
    fontSize: 40,
    position: WatermarkPositionEnum.rightBottom,
    textColor: '#FFFFFF',
    opacity: 0.5
  },
  showAnnouncement: true
}

const initUserSettings = (): UserSettingsModel => {
  const LSSettings = getLocal(LS_SETTINGS)
  if (LSSettings) {
    deepAssignObject(initSettings, LSSettings)
  }
  return initSettings
}

const initGlobalSettings = (): GlobalSettingsModel => {
  const globalSettings: GlobalSettingsModel = {
    showAnnouncement: true,
    folded: false,
    elementPlusSize: ElementPlusSizeEnum.default,
    language: LanguageEnum.zhCN,
    languageToggleTip: true,
    theme: ThemeModeEnum.system,
    useCloudSettings: false
  }

  const SSSettings = getSession(SS_GLOBAL_SETTINGS)
  if (SSSettings) {
    deepAssignObject(globalSettings, SSSettings)
  }
  return globalSettings
}

const userSettingsModule: Module<UserSettingsStateTypes, RootStateTypes> = {
  state: {
    userSettings: initUserSettings(),
    cloudSettings: null,
    globalSettings: initGlobalSettings()
  },

  actions: {
    // 赋值用户设置信息
    SET_USER_SETTINGS({ state, dispatch }, settingsInfo: UserSettingsModel) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in settingsInfo) {
        if (Object.hasOwn(state.userSettings, key)) {
          // @ts-ignore
          state.userSettings[key] = settingsInfo[key]
        }
      }
      dispatch('USER_SETTINGS_PERSIST')
    },

    // 赋值云端仓库设置信息
    SET_CLOUD_SETTINGS({ state }, cloudSettings: UserSettingsStateTypes['cloudSettings']) {
      state.cloudSettings = cloudSettings
    },

    // 赋值全局设置信息
    SET_GLOBAL_SETTINGS({ state }, globalSettings: UserSettingsStateTypes['globalSettings']) {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in globalSettings) {
        // @ts-ignore
        state.globalSettings[key] = globalSettings[key]
      }
      setSession(SS_GLOBAL_SETTINGS, state.globalSettings)
    },

    // 图片链接类型 - 增加规则
    ADD_IMAGE_LINK_TYPE_RULE({ state, dispatch }, { rule }) {
      const ruleObjs = state.userSettings.imageLinkType.presetList
      if (!Object.hasOwn(ruleObjs, rule.name)) {
        imgLinkRuleVerification(rule, ImgLinkRuleActionsEnum.add, (e: boolean) => {
          if (e) {
            state.userSettings.imageLinkType.presetList[rule.name] = rule
            dispatch('USER_SETTINGS_PERSIST')
          }
        })
      } else {
        ElMessage.error(i18n.global.t('settings_page.link_rule.error_msg_1'))
      }
    },

    // 图片链接类型 - 修改规则
    UPDATE_IMAGE_LINK_TYPE_RULE({ state, dispatch }, { rule }) {
      imgLinkRuleVerification(rule, ImgLinkRuleActionsEnum.edit, (e: boolean) => {
        if (e) {
          state.userSettings.imageLinkType.presetList[rule.name].rule = rule.rule
          dispatch('USER_SETTINGS_PERSIST')
        }
      })
    },

    // 图片链接类型 - 删除规则
    DEL_IMAGE_LINK_TYPE_RULE({ state, dispatch }, rule: ImageLinkRuleModel) {
      delete state.userSettings.imageLinkType.presetList[rule.name]
      dispatch('USER_SETTINGS_PERSIST')
    },

    // 持久化用户设置数据
    USER_SETTINGS_PERSIST({ state }) {
      setLocal(LS_SETTINGS, state.userSettings)
    },

    // 持久化全局设置数据
    USER_GLOBAL_PERSIST({ state }) {
      setSession(SS_GLOBAL_SETTINGS, state.globalSettings)
    },

    // 退出登录
    USER_SETTINGS_LOGOUT({ state }) {
      state.userSettings = initSettings
    }
  },

  getters: {
    getUserSettings: (state) => state.userSettings,
    getCloudSettings: (state) => state.cloudSettings,
    getGlobalSettings: (state) => state.globalSettings
  }
}

export default userSettingsModule
