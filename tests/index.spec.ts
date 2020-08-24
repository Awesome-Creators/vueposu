import { shallowMount } from "@vue/test-utils";
import Test from "../src/Test.vue";

describe("Test.vue", () => {
  it("simple test", () => {
    const wrapper = shallowMount(Test);
    expect(wrapper.find("div").text()).toMatch("hello test");
  });

  it("test toggle", async () => {
    const wrapper = shallowMount(Test);
    expect(wrapper.find("span").text()).toMatch("false");
    (wrapper.vm as any).toggle();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("span").text()).toMatch("true");
  });
});
