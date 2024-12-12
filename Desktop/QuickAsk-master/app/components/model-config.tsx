import { ALL_MODELS, ModalConfigValidator, ModelConfig } from "../store";

import Locale from "../locales";
import { InputRange } from "./input-range";
import { List, ListItem } from "./ui-lib";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function ModelConfigList(props: {
  modelConfig: ModelConfig;
  isColorInverted?: boolean;
  updateConfig: (updater: (config: ModelConfig) => void) => void;
}) {
  return (
    <>
      <ListItem
        title={Locale.Settings.Model}
        className={`${
          props.isColorInverted ? "bg-[#7D7D7D30]" : "bg-white "
        } dark:bg-[#7d7d7d30]  !px-4 md:!px-10 !py-5 rounded-[10px] mt-2`}
      >
        <Select
          value={props.modelConfig.model}
          onValueChange={(e) => {
            props.updateConfig(
              (config) => (config.model = ModalConfigValidator.model(e)),
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {ALL_MODELS.map((v) => (
              <SelectItem value={v.name} key={v.name}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ListItem>
      <ListItem
        title={Locale.Settings.Temperature.Title}
        subTitle={Locale.Settings.Temperature.SubTitle}
        className={`${
          props.isColorInverted ? "bg-[#7D7D7D30]" : "bg-white "
        } dark:bg-[#7d7d7d30]  !px-4 md:!px-10 !py-5 rounded-[10px] mt-2`}
      >
        <div className="ring-1 ring-[#69A606] rounded-lg w-full max-w-[348px] py-3 px-6 flex gap-4 items-center">
          <span className="whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
            {props.modelConfig.temperature}
          </span>
          <Slider
            defaultValue={[props.modelConfig.temperature]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={(e) => {
              props.updateConfig(
                (config) =>
                  (config.temperature = ModalConfigValidator.temperature(
                    e[0] as any,
                  )),
              );
            }}
          />
        </div>
      </ListItem>
      <ListItem
        title={Locale.Settings.MaxTokens.Title}
        subTitle={Locale.Settings.MaxTokens.SubTitle}
        className={`${
          props.isColorInverted ? "bg-[#7D7D7D30]" : "bg-white "
        } dark:bg-[#7d7d7d30]  !px-4 md:!px-10 !py-5 rounded-[10px] mt-2`}
      >
        <input
          type="number"
          className="ring-1 ring-[#69A606] w-full max-w-[228px] py-2 px-3 outline-none rounded-lg bg-transparent"
          min={100}
          max={32000}
          value={props.modelConfig.max_tokens}
          onChange={(e) =>
            props.updateConfig(
              (config) =>
                (config.max_tokens = ModalConfigValidator.max_tokens(
                  e.currentTarget.valueAsNumber,
                )),
            )
          }
        ></input>
      </ListItem>
      <ListItem
        title={Locale.Settings.PresencePenalty.Title}
        subTitle={Locale.Settings.PresencePenalty.SubTitle}
        className={`${
          props.isColorInverted ? "bg-[#7D7D7D30]" : "bg-white "
        } dark:bg-[#7d7d7d30]  !px-4 md:!px-10 !py-5 rounded-[10px] mt-2`}
      >
        <div className="ring-1 ring-[#69A606] rounded-lg w-full max-w-[348px] py-3 px-6 flex gap-4 items-center">
          <span className="whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
            {props.modelConfig.presence_penalty?.toFixed(1)}
          </span>
          <Slider
            defaultValue={[
              props.modelConfig.presence_penalty?.toFixed(1) as any,
            ]}
            min={-2}
            max={2}
            step={0.1}
            onValueChange={(e) => {
              props.updateConfig(
                (config) =>
                  (config.presence_penalty =
                    ModalConfigValidator.presence_penalty(e[0])),
              );
            }}
          />
        </div>
      </ListItem>

      <ListItem
        title={Locale.Settings.HistoryCount.Title}
        subTitle={Locale.Settings.HistoryCount.SubTitle}
        className={`${
          props.isColorInverted ? "bg-[#7D7D7D30]" : "bg-white "
        } dark:bg-[#7d7d7d30]  !px-4 md:!px-10 !py-5 rounded-[10px] mt-2`}
      >
        <div className="ring-1 ring-[#69A606] rounded-lg w-full max-w-[348px] py-3 px-6 flex gap-4 items-center">
          <span className="whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
            {props.modelConfig.historyMessageCount}
          </span>
          <Slider
            defaultValue={[props.modelConfig.historyMessageCount]}
            min={0}
            max={32}
            step={1}
            onValueChange={(e) => {
              props.updateConfig(
                (config) => (config.historyMessageCount = e as any),
              );
            }}
          />
        </div>
      </ListItem>

      <ListItem
        title={Locale.Settings.CompressThreshold.Title}
        subTitle={Locale.Settings.CompressThreshold.SubTitle}
        className={`${
          props.isColorInverted ? "bg-[#7D7D7D30]" : "bg-white "
        } dark:bg-[#7d7d7d30]  !px-4 md:!px-10 !py-5 rounded-[10px] mt-2`}
      >
        <input
          type="number"
          className="ring-1 ring-[#69A606] w-full max-w-[228px] py-2 px-3 outline-none rounded-lg bg-transparent"
          min={500}
          max={4000}
          value={props.modelConfig.compressMessageLengthThreshold}
          onChange={(e) =>
            props.updateConfig(
              (config) =>
                (config.compressMessageLengthThreshold =
                  e.currentTarget.valueAsNumber),
            )
          }
        ></input>
      </ListItem>
      <ListItem
        title={Locale.Memory.Title}
        subTitle={Locale.Memory.Send}
        className={`${
          props.isColorInverted ? "bg-[#7D7D7D30]" : "bg-white "
        } dark:bg-[#7d7d7d30]  !px-4 md:!px-10 !py-5 rounded-[10px] mt-2`}
      >
        <input
          type="checkbox"
          className="peer cursor-pointer relative h-10 w-10 p-4 shrink-0 appearance-none rounded-lg bg-transparent border border-[#69A606] after:absolute after:left-0 after:top-0 after:h-full after:w-full checked:after:bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgB7ZU9TsNAEIXfW8s/0GBu4HR0NByAG0RIFJFpkgpT4SNwA0IRAVVEQaiQyAkQPQU3AE6A6cJa9rBrIcSfUH6czl8xmllpn0ZTvEf8QTpEmHvBGqbA1ZPXfg/Zz3d+HfYv3UNFpqaNMAMCPBFydBrnF7+Ek5F7S3AbC1ACN+ex3rG9Y8vByD02oh0siNlyY2uXuL8u75gMEdH3HlEXIpmv85ZyVrxN1AkZvvluWxWFrGMJKCyJRrgRboT/Eyad+gzoA6E8V35sbPPFuEeIGrCmfxbrVnUKpdhFTTiCtNK0ZdDRY4qNJMkwN/avdAd7emynb5mXXAWRsGir0kQUpzyNMXYhHoLJ6km/l30u9g5sm0xb/aISiAAAAABJRU5ErkJggg==')] after:bg-[length:19px] after:bg-center after:bg-no-repeat after:content-[''] focus:outline-none"
          checked={props.modelConfig.sendMemory}
          onChange={(e) =>
            props.updateConfig(
              (config) => (config.sendMemory = e.currentTarget.checked),
            )
          }
        ></input>
      </ListItem>
    </>
  );
}
