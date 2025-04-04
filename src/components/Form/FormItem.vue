<script setup lang="ts">
import { isNil } from 'lodash-es'
import { inject,computed, reactive, provide, onMounted, onUnmounted } from 'vue'
import type { FormItemContext, FormItemInstance, FormItemProps, FormValidateFailure, ValidateStatusProps } from './types';
import { formContextKey, formItemContextKey } from './types';
import Schema from 'async-validator'
defineOptions({
  name:'YFormItem'
})
//
const validateStatus:ValidateStatusProps = reactive({
  state:'init',
  errorMsg:'',
  loading:false
})
let initialValue:any = null
const props = defineProps<FormItemProps>()
const formContext = inject(formContextKey)
const innerValue = computed(()=>{
const model = formContext?.model
  if(model && props.prop && !isNil(model[props.prop])){
    return model[props.prop]
  }else{
    return null
  }
})
const itemRules = computed(()=>{
  const rules = formContext?.rules
  if(rules && props.prop && rules[props.prop]){
    return rules[props.prop]
  }else{
    return[]
  }
})
const getTriggeredRules = (trigger?:string)=>{
  const rules = itemRules.value
  if(rules){
    return rules.filter(rule =>{
      if(!rule.trigger ||!trigger) return true
      return rule.trigger && rule.trigger === trigger
    })
  }else{
    return[]
  }
}
const validate = async (trigger?:string)=>{
  const modelName = props.prop
  const triggeredRules = getTriggeredRules(trigger)
  if(triggeredRules.length === 0){
    return true
  }
  if(modelName){
    const validator = new Schema({
      [modelName]:triggeredRules
    })
    validateStatus.loading = true
    return validator.validate({[modelName]:innerValue.value})
    .then(()=>{
      validateStatus.state = 'success'
    })
    .catch((e:FormValidateFailure)=>{
      const {errors} = e
      validateStatus.state = 'error'
      validateStatus.errorMsg = (errors && errors.length>0)?errors[0].message||'':''
      console.log(e.errors);
      return Promise.reject(e)
    })
    .finally(()=>{
      validateStatus.loading = false
    })
  }
}
//清除验证
const clearValidate = ()=>{
  validateStatus.state='init'
  validateStatus.errorMsg = ''
  validateStatus.loading = false
}
const resetField = ()=>{
  clearValidate()
  const model = formContext?.model
  if(model && props.prop && !isNil(model[props.prop])){
    console.log(props.prop)
    model[props.prop] = initialValue
  }
}
const context:FormItemContext = {
  validate,
  prop:props.prop || '',
  resetField,
  clearValidate,
}
const isRequired = computed(()=>{
  return itemRules.value.some(rule => rule.required)
})
provide(formItemContextKey,context)
onMounted(()=>{
  if(props.prop){
    formContext?.addField(context)
    initialValue = innerValue.value
  }
})
onUnmounted(()=>{
  formContext?.removeField(context)
})
defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidate
})
</script>

<template>
  <div
   class="yun-form-item"
   :class="{
    'is-error':validateStatus.state === 'error',
    'is-success':validateStatus.state === 'success',
    'is-loading':validateStatus.loading,
    'is-required':isRequired
   }" 
   >
    <label class="yun-form-item__label">
      <slot name="label" :label="label">
        {{ label }}
      </slot>

    </label>
    <div class="yun-form-item__content">
      <slot :validate="validate"></slot>
      <div
       class="yun-form-item__error-msg"
       v-if="validateStatus.state === 'error'"
       >
        {{ validateStatus.errorMsg }}
      </div>
    </div>
  </div>
</template>