import { shallowMount } from "@vue/test-utils";
import Test from "../src/Test.vue";

describe("Test.vue", () => {
  it("simple test", () => {
    const wrapper = shallowMount(Test);
    expect(wrapper.find("div").text()).toMatch("hello test");
  });
});
