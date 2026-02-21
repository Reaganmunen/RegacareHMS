import React from 'react'
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from './form';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { Textarea } from './textarea';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import { Switch } from './switch';

interface InputProps{
    type: "input" | "select" | "checkbox" | "switch" | "radio" | "textarea";
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    inputType?: "text" | "email" | "password" | "date";
    selectList?: { label: string; value: string }[];
    defaultValue?: string
}
const RenderInput =({field, props} : {field: any; props:InputProps})=> {
    switch (props.type) {
        case "input":
            return(
                <FormControl>
                    <Input
                    type={props.inputType}
                    placeholder={props.placeholder}
                    {...field}
                    />
                </FormControl>
            );
        case "select":
            return (
                <Select onValueChange={field.onChange} value={field?.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={props.placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {props.selectList?.map((i ,id) =>( 
                            <SelectItem key={id} value={i.value}>
                                {i.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case "checkbox":
             return (
                <div className="items-top flex space-x-2">
                    <Checkbox 
                    id={props.name}
                    onCheckedChange={(e) => field.onChange(e === true)}
                    
                    />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor={props.name}
                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                        {props.label}
                        
                    </label>
                    <p className="text-sm text-muted-foreground">{props.placeholder}</p>
                </div>

                </div>
             );
    case "textarea":
        return(
            <FormControl>
                <Textarea
                type={props.inputType}
                placeholder={props.placeholder}
                {...field}
                ></Textarea>
            </FormControl>
        );
    
                
             case "radio":
      return (
        <div className="w-full">
          <FormLabel className="mb-2 block">{props.label}</FormLabel>

          <RadioGroup
            defaultValue={props.defaultValue}
            onValueChange={field.onChange}
            className="flex gap-4 w-full"
          >
            {props.selectList?.map((i, id) => (
              <div className="flex-1" key={id}>
                <RadioGroupItem
                  value={i.value}
                  id={i.value}
                  className="peer sr-only"
                />

                <Label
                  htmlFor={i.value}
                  className="
                 flex items-center justify-center
                w-full py-3
                rounded-full border-2 cursor-pointer
                bg-black text-white
                transition
                text-sm font-medium

                peer-data-[state=checked]:border-blue-500
                peer-data-[state=checked]:shadow-[0_0_10px_rgba(59,130,246,0.7)]
                peer-data-[state=checked]:bg-black

                hover:bg-black/80
              "
                >
                  {i.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
        
        

    }
}

export const CustomInput = (props: InputProps) => {
    const {name, label, control, type} = props;
  return(
    <FormField
  control={control}
  name={name}
  render= {({field})=> (
    <FormItem className="w-full">
        {type !=="radio" && type !=="checkbox" && (
            <FormLabel>{label}</FormLabel>
        )}
        <RenderInput field={field} props={props}/>

    </FormItem>

  )}
 />
  )
  
  
};


type Day = {
    day: string;
    start_time?:string;
    close_time?: string;

};
interface SwitchProps{
    data: {label:string; value: string;} [];
    setWorkSchedule: React.Dispatch<React.SetStateAction<Day[]>>
}

export const SwitchInput = ({data,setWorkSchedule}:SwitchProps)=>{

    const handleChange = (day: string, field:any, value:string)=>{
        setWorkSchedule((prevDays)=>{
            const dayExists = prevDays.find((d)=> d.day === day)

            if(dayExists){
                return prevDays.map((d)=>
                d.day ===day ? { ...d, [field]: value} : d
                );
            }else{
                if(field===true){
                    return[...prevDays, {day, start_time:"09:00", close_time: "17:00"}];
                }else{
                    return[...prevDays, {day, [field]: value}];
                }
            }
        })
    }

    return(
        <div>
            {
                data?.map((el, id)=>(
                    <div key={id}
                    className="w-full flex items-center space-y-3 border-t border-t-gray-200 py-3"
                    >
                        <Switch
                        id={el.value}
                        className="data-[state=checked]:bg-blue-600 peer" 
                        onCheckedChange={e=>handleChange(el.value, true, "9:00")}/>
                        <Label htmlFor={el.value} className="w-20 capitalize">
                            {el.label}
                        </Label>
                        <Label className="text-gray-400 font-normal italic peer-data-[state=checked]:hidden pl-10">
                            Not Available
                        </Label>


                        <div className="hidden peer-data-[state=checked]:flex items-center gap-2 pl-6:">
                            <Input
                            name={`${el.label}.start_time`}
                            type="time"
                            defaultValue="09:00"
                            onChange={e=> handleChange(el.value, "start_time", e.target.value)}
                            
                            />

                            <Input
                            name={`${el.label}.close_time`}
                            type="time"
                            defaultValue="17:00"
                            onChange={e=> handleChange(el.value, "close_time", e.target.value)}
                            
                            />
                        </div>
                    </div>

                ))
            }
        </div>
    )
    

}