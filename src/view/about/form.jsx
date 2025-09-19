export function form1(props, { slots, emit, attrs, expose }) {
  //   const formData = toRef(props, "formData");
  const formData = reactive({
    name: "name密码33333333333333",
    password: "password提交",
  });

  //   const input = computed({
  //     get() {
  //       return formData.password;
  //     },
  //     set(val) {
  //       formData.password = val;
  //     },
  //   });
  const input = ref("ref");

  return (
    <el-form status-icon label-width="auto">
      <el-form-item label="密码11">
        <el-input modelValue={input.value} onUpdate:modelValue={(e) => (input.value = e)} placeholder="密码" />
      </el-form-item>
      <el-form-item label="提交">
        <el-input modelValue={formData.name} onUpdate:modelValue={(e) => (formData.name = e)} placeholder="提交" />
      </el-form-item>
    </el-form>
  );
}

export function form2(props, { slots, emit, attrs, expose }) {
  function reactiverReset(obj) {
    const cloneObj = JSON.parse(JSON.stringify(obj));
    const val = reactiver(obj);
    const reset = () => {
      for (const key in val) {
        val[key] = cloneObj[key];
      }
    };
    return [val, reset];
  }
  // 生成随机的30条数据
  const options = Array.from({ length: 30 }, (_, i) => {
    return {
      id: i + 1,
      name: `name${i + 1}`,
    };
  });

  const formData = reactive({
    name: "form211111111111111111",
    password: "form2",
    id: 2,
  });
  const input = ref("form2");
  return (
    <el-dialog draggable destroy-on-close modelValue={props.modelValue} onUpdate:modelValue={(e) => emit("update:modelValue", e)} title="提示框" width="80%">
      <el-form status-icon inline label-width="auto">
        <el-form-item label="密码22">
          <el-input modelValue={input.value} onUpdate:modelValue={(e) => (input.value = e)} placeholder="密码" />
        </el-form-item>
        <el-form-item label="提交">
          <el-input modelValue={formData.name} onUpdate:modelValue={(e) => (formData.name = e)} placeholder="提交" />
        </el-form-item>
        <el-form-item label="提交">
          <el-select modelValue={formData.id} onUpdate:modelValue={(e) => (formData.id = e)} placeholder="选择">
            {options.map((item) => (
              <el-option key={item.id} label={item.name} value={item.id} />
            ))}
          </el-select>
        </el-form-item>
        <el-form-item label="提交">
          <el-input modelValue={formData.name} onUpdate:modelValue={(e) => (formData.name = e)} placeholder="提交" />
        </el-form-item>
        <el-form-item label="提交">
          <el-select modelValue={formData.id} onUpdate:modelValue={(e) => (formData.id = e)} placeholder="选择">
            {options.map((item) => (
              <el-option key={item.id} label={item.name} value={item.id} />
            ))}
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="primary" onClick={() => emit("update:modelValue", false)}>
          提交
        </el-button>
        <el-button onClick={() => emit("update:modelValue", false)}>取消</el-button>
      </div>
    </el-dialog>
  );
}
