         //airtable family search script ownded by gove.allen@
         const endpoint = "https://script.google.com/macros/s/AKfycbyXbIv4HQocfFa3QfedpK3PdoCLnElof--9Ngk8so-N1TZBl7wnmH8_34NiTKVuGkwxgg/exec"
         let person=""
         async function start_me_up(){
          getListOfPeople()
         }
  
         async function record_pid(evt){



            let table=evt.target
            while(table.tagName.toUpperCase()!=="TABLE"){
                table=table.parentNode
            }

            const input_tag=table.querySelector(".pid-field")
            input_tag.style.backgroundColor="grey"

              if(!input_tag.value){
                  alert("PID required")
                  return
              }
              
  
              const response  = await fetch(endpoint + `?mode=addrecord&person=${input_tag.dataset.record_id}&pid=${input_tag.value}`)
              const text = await response.text();
              console.log(text)
              const rec = JSON.parse(text)
              console.log(rec.records[0]);
              if(rec.records[0].fields.pid===input_tag.value){
                  input_tag.style.backgroundColor="lightgreen"
                }else{
                  alert("Difficulty not recorded.  This is unexpected. Contact Administrator")
                  input_tag.style.backgroundColor="red"
                }
  
          }          
          async function update_difficulty(evt){

            let table=evt.target
            while(table.tagName.toUpperCase()!=="TABLE"){
                table=table.parentNode
            }

            const input_tag=table.querySelector(".difficulty-field")
            input_tag.style.backgroundColor="grey"
            console.log("input_tag",input_tag)
              if(!input_tag.value){
                  alert("Difficulty required")
                  return
              }
              
  
              const response  = await fetch(endpoint + `?mode=updatedifficulty&person=${input_tag.dataset.record_id}&difficulty=${input_tag.value}`)
              const text = await response.text();
              console.log("text",text)
              const rec = JSON.parse(text)
              console.log("rec",rec.records[0]);
              if(rec.records){
                  input_tag.style.backgroundColor="lightgreen"
                }else{
                  alert("PID not recorded.  This is unexpected. Contact Administrator")
                  input_tag.style.backgroundColor="red"
                }
  
          }
  
        async function getListOfPeople(){
            const status = new URLSearchParams(window.location.search).get('status') 
            let suffix="?mode=allrecords"
            if(status){suffix += "&suffix=" + status}

            const response  = await fetch(endpoint+suffix)
            const text = await response.text();
            console.log(text)
            const records = JSON.parse(text)
            console.log("records",records);

            const {input, tr, td, table, button} = van.tags
            let data_row="data-row-even"

            for(const record of records ){
                const wiki_button=button(
                    "Web Article"
                )
                wiki_button.dataset.url=record.fields["url"]
                wiki_button.addEventListener("click", (evt) => {open_page(evt)});
                
                const familysearch_button=button(
                    "Family Search"
                )
                familysearch_button.dataset.url=record.fields["link"]
                familysearch_button.addEventListener("click", (evt) => {family_search(evt)});
                
                const update_pid_button=button(
                    {class:"pid-button"},
                    "Update"
                )
                update_pid_button.addEventListener("click", (evt) => {record_pid(evt)});

                const update_difficulty_button=button(
                    {class:"difficulty-button"},
                    "Update"
                )
                update_difficulty_button.addEventListener("click", (evt) => {update_difficulty(evt)});

                const table_row= tr({class:data_row},
                    td(record.fields["full_name"]),
                    td(wiki_button,familysearch_button),
                    td(record.fields["difficulty"]),
                    td(record.fields["group_names"]),
                )
                
                table_row.addEventListener("click", (evt) => {toggle_next_visibility(evt)});
                
                tag("person-table").appendChild(table_row)
                
                tag("person-table").appendChild(
                    tr({class:"drawer",style:"display:none"},
                        td({colspan:4,style:"background-color:lemonChiffon"},
                            table({style:"margin-left:2rem"},
                                tr(
                                    td("Birth"),
                                    td(record.fields["birth"]),
                                ),
                                tr(
                                    td("Birth Place"),
                                    td(record.fields["birthplace"]),
                                ),
                                tr(
                                    td("Death"),
                                    td(record.fields["death"]),
                                ),
                                tr(
                                    td("Death Place"),
                                    td(record.fields["deathplace"]),
                                ),
                                tr(
                                    td("PID"),
                                    td(input({id:record.id, class:"pid-field", "data-record_id":record.id}),
                                    update_pid_button
                                    ),
                                ),
                                tr(
                                    td("Difficulty"),
                                    td(input({id:"d-"+record.id, class:"difficulty-field", "data-record_id":record.id, value:record.fields["difficulty"]}),
                                    update_difficulty_button
                                    ),
                                )
                            )
                        )

                    )
                )
                if(data_row==="data-row-even"){
                    data_row="data-row-odd"
                }else{
                    data_row="data-row-even"
                }
            }
    }


    function open_page(evt){
        console.log(evt.target)
        //evt.stopPropagation()

        const newwindow=window.open(evt.target.dataset.url,"webarticle");
        if (window.focus) {newwindow.focus()}   
    }

    function family_search(evt){
        const newwindow=window.open(evt.target.dataset.url,"familySearch");
        if (window.focus) {newwindow.focus()}   
    }




    function toggle_next_visibility(evt){
            for(const elem of document.querySelectorAll(".drawer")){
            elem.style.display="none"
        }
        for(const elem of document.querySelectorAll(".data-row-odd")){
            elem.style.backgroundColor=""
        }
        for(const elem of document.querySelectorAll(".data-row-even")){
            elem.style.backgroundColor=""
        }

        console.log(evt.target.tagName,evt.target)
        let elem=evt.target
        while(elem.tagName.toUpperCase()!=="TR"){
            elem=elem.parentNode
        }
        elem.style.backgroundColor="lemonchiffon"
        elem=elem.nextElementSibling
        if(elem.style.display==="none"){
            console.log("elem:",elem)
            elem.style.display=""
        }else{
            elem.style.display="none"
        }
      

    }

          async function get_person(){
             
              const status = new URLSearchParams(window.location.search).get('status') 
              let suffix="?mode=getrecord"
              if(status){suffix += "&suffix=" + status}
  
              const response  = await fetch(endpoint+suffix)
              const text = await response.text();
              console.log(text)
              const rec = JSON.parse(text)
              console.log(rec);
              person = rec.id
              // let url=rec.fields.report_link
              // url=url.split(".com/").join(".com/embed/")+"&hide_person=true"
              // tag("report_link").src=url
  //            tag("link").src= rec.fields.report_link
              tag("full_name").innerHTML = rec.fields.full_name || ""
              tag("birth").innerHTML = rec.fields.birth || ""
              tag("birthplace").innerHTML = rec.fields.birthplace || ""
              tag("death").innerHTML = rec.fields.death || ""
              tag("deathplace").innerHTML = rec.fields.deathplace || ""
              tag("pid").value = ""
  
              tag("pid").focus()
  
              if(rec.fields.url){
                  newwindow=window.open(rec.fields.url,"wikipedia");
                  if (window.focus) {newwindow.focus()}     
              }
  
              newwindow=window.open(rec.fields.link,"family-search");
              if (window.focus) {newwindow.focus()}     
  
              window.focus()
  
          }
          
          function tag(id){
              return document.getElementById(id)
          }
         
  
  