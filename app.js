new Vue({

    el:"#app",

    data:{
        symbols:{},
        

        amount: 0,

        from: '',
        
        to: '',

        result: 0, 

        loading: false,

        timestamp: '',
    },

    created() {
        setInterval(() => {
          this.getCurrentDate();
        }, 1000)
    },

    //hook
    mounted(){
        // this.getCurrencies();
        this.getSymbols();

    },
    computed:{
        //always refershed when updated
        

        formattedSymbols(){
            return Object.values(this.symbols)
        },

        calculateResult(){
            return (Number(this.amount) *  this.result).toFixed(3)
        },

        disabled(){
            return this.amount===0 || !this.amount || this.loading;
        }
    },
    methods:{
        
        getSymbols(){
            const symbols= localStorage.getItem("symbols")

            if(symbols){
                this.symbols=JSON.parse(symbols);
                return;
            }

            axios.get("https://api.exchangerate.host/symbols")
            .then(response=>{
                this.symbols=response.data.symbols;
                localStorage.setItem('currSymbols',JSON.stringify(response.data.symbols))
            })
        },
      
        convertCurrencies(){
            const key= `from=${this.from}&to=${this.to}`;
            this.loading=true;
            axios.get(`https://api.exchangerate.host/convert?${key}`)
            .then((response)=>{
                this.loading=false,
                this.result=response.data.result
            }
                
                // console.log(response.data.result)
            )
        },
        getCurrentDate(){
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const dateTime = date +' '+ time;
            this.timestamp=dateTime;

        },


  
    },
    
    watch:{
        //watch in case any value change
        from(){
            this.result=0;
        },


        to(){
            this.result=0;
        }
    }

})